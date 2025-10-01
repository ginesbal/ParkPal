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

  const armSessionReset = useCallback(() => {
    if (sessionResetTimer.current) clearTimeout(sessionResetTimer.current);
    sessionResetTimer.current = setTimeout(
      () => setSessionToken(newSessionToken()),
      3 * 60 * 1000
    );
  }, []);

  useEffect(() => {
    armSessionReset();
    return () => {
      if (sessionResetTimer.current) clearTimeout(sessionResetTimer.current);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [armSessionReset]);

  const search = useCallback(async (text) => {
    if (text.length < minChars) { setSuggestions([]); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetcher({
        url: 'autocomplete',
        params: { input: text, sessiontoken: sessionToken, language, components }
      });
      setSuggestions(res?.predictions ?? []);
    } catch (e) {
      setError(e); setSuggestions([]);
    } finally { setLoading(false); }
  }, [components, fetcher, language, minChars, sessionToken]);

  const onChangeText = useCallback((text) => {
    setInput(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => search(text), debounceMs);
  }, [search, debounceMs]);

  const selectPrediction = useCallback(async (prediction) => {
    setLoading(true); setError(null);
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

      // reset session token after a successful selection
      setSessionToken(newSessionToken());
      armSessionReset();
      return res?.result || null;
    } catch (e) {
      setError(e); return null;
    } finally { setLoading(false); }
  }, [armSessionReset, fetcher, language, sessionToken]);

  return { input, onChangeText, suggestions, loading, error, selectPrediction };
}
