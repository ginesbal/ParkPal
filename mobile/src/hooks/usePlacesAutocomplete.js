import { useCallback, useEffect, useRef, useState } from 'react';

const newSessionToken = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export default function usePlacesAutocomplete({
  fetcher,           // async ({ url, params }) => Promise<json>
  minChars = 2,
  debounceMs = 250,
  language = 'en',
  components = 'country:ca',
}) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [sessionToken, setSessionToken] = useState(newSessionToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);
  const sessionResetTimer = useRef(null);
  // Guards against setState after unmount and against out-of-order autocomplete
  // responses clobbering a newer query's results.
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  const armSessionReset = useCallback(() => {
    if (sessionResetTimer.current) clearTimeout(sessionResetTimer.current);
    sessionResetTimer.current = setTimeout(
      () => {
        if (isMountedRef.current) setSessionToken(newSessionToken());
      },
      3 * 60 * 1000
    );
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    armSessionReset();
    return () => {
      isMountedRef.current = false;
      if (sessionResetTimer.current) clearTimeout(sessionResetTimer.current);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [armSessionReset]);

  const search = useCallback(async (text) => {
    if (text.length < minChars) {
      if (isMountedRef.current) setSuggestions([]);
      return;
    }
    const requestId = ++requestIdRef.current;
    if (isMountedRef.current) { setLoading(true); setError(null); }
    try {
      const res = await fetcher({
        url: 'autocomplete',
        params: { input: text, sessiontoken: sessionToken, language, components }
      });
      // Drop stale responses: a newer search has started since this fetch began.
      if (!isMountedRef.current || requestId !== requestIdRef.current) return;
      setSuggestions(res?.predictions ?? []);
    } catch (e) {
      if (!isMountedRef.current || requestId !== requestIdRef.current) return;
      setError(e); setSuggestions([]);
    } finally {
      if (isMountedRef.current && requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [components, fetcher, language, minChars, sessionToken]);

  const onChangeText = useCallback((text) => {
    setInput(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => search(text), debounceMs);
  }, [search, debounceMs]);

  const selectPrediction = useCallback(async (prediction) => {
    if (isMountedRef.current) { setLoading(true); setError(null); }
    try {
      const res = await fetcher({
        url: 'details',
        params: {
          place_id: prediction.place_id,
          sessiontoken: sessionToken,
          language,
          fields: 'place_id,geometry/location,formatted_address,name,types'
        }
      });

      if (!isMountedRef.current) return res?.result || null;
      // reset session token after a successful selection
      setSessionToken(newSessionToken());
      armSessionReset();
      return res?.result || null;
    } catch (e) {
      if (isMountedRef.current) setError(e);
      return null;
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [armSessionReset, fetcher, language, sessionToken]);

  return { input, onChangeText, suggestions, loading, error, selectPrediction };
}
