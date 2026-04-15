import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { RADIUS, TOKENS, alpha } from '../../constants/theme';
import usePlacesAutocomplete from '../../hooks/usePlacesAutocomplete';
import { logger } from '../../utils/loggers';

// Generic, non-leaky message for the error card. We never surface raw
// fetch/API error text to users — it can expose backend internals.
const USER_ERROR_MESSAGE = 'Search is offline. Check your connection.';

// Maps Google Places prediction types to a glyph. Coerces `types` to an array
// so malformed payloads can't crash the row render.
const iconForTypes = (types) => {
  const t = Array.isArray(types) ? types : [];
  if (t.includes('airport')) return 'airplane';
  if (t.includes('establishment')) return 'domain';
  return 'map-marker';
};

// dev fetcher: calls google places api directly (exposes api key in bundle)
// requires "places api" (legacy) enabled in google cloud console
const devDirectFetcher = async ({ url, params }) => {
  const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY;
  if (!API_KEY) throw new Error('Missing EXPO_PUBLIC_GOOGLE_PLACES_KEY');

  // these are legacy places api endpoints - require "places api" not "places api (new)"
  const base = url === 'autocomplete'
    ? 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
    : 'https://maps.googleapis.com/maps/api/place/details/json';

  const qs = new URLSearchParams({ key: API_KEY, ...params }).toString();
  const resp = await fetch(`${base}?${qs}`);
  const json = await resp.json();

  // check api errors
  if (json.status && json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Places: ${json.status} ${json.error_message || ''}`);
  }
  return json;
};

// production fetcher: routes through backend to protect api key
const productionFetcher = async ({ url, params }) => {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
  const endpoint = url === 'autocomplete' ? '/api/places/autocomplete' : '/api/places/details';
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${baseUrl}${endpoint}?${queryString}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch places');
  }

  return response.json();
};

function SearchLoadingDots() {
  const fade = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(fade, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [fade]);

  return (
    <Animated.View style={[styles.loadingDots, { opacity: fade }]}>
      <View style={styles.loadingDot} />
      <View style={styles.loadingDot} />
      <View style={styles.loadingDot} />
    </Animated.View>
  );
}

export default function PlacesSearchBar({
  onPlaceSelected = () => { },
  onFocusChange = () => { },
  fetcher = __DEV__ ? devDirectFetcher : productionFetcher,
  components = 'country:ca',
  placeholder = 'Search address or place',
  minChars = 2,
  debounceMs = 250,
  containerStyle,
  style,
}) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // --- DEBUG INSTRUMENTATION -------------------------------------------
  // Unique per-mount identifier. If this value is different when blur fires
  // vs when focus fired, the component was remounted (i.e., the native
  // TextInput was destroyed and recreated — which always resigns first
  // responder and dismisses the keyboard).
  const mountIdRef = useRef(null);
  if (mountIdRef.current == null) {
    mountIdRef.current = Math.random().toString(36).slice(2, 8);
  }
  // Render counter — if this jumps between focus and blur, we're re-rendering
  // the TextInput a suspicious number of times.
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  logger.log('dbg_search_render', {
    mountId: mountIdRef.current,
    renderCount: renderCountRef.current,
    isFocused,
    showSuggestions,
  }, 'DBG');
  // --------------------------------------------------------------------

  const {
    input,
    onChangeText,
    suggestions,
    loading,
    error,
    selectPrediction
  } = usePlacesAutocomplete({
    fetcher,
    components,
    minChars,
    debounceMs
  });

  // handles place selection: gets details, extracts coordinates, notifies parent
  const handleSelect = async (item) => {
    Keyboard.dismiss();
    setShowSuggestions(false);

    // fetch full place details including coordinates
    const place = await selectPrediction(item);

    if (!place?.geometry?.location) return;

    const { lat, lng } = place.geometry.location;

    onChangeText('');
    inputRef.current?.blur();

    onPlaceSelected({
      lat,
      lng,
      name: place.name || item.structured_formatting?.main_text || '',
      address: place.formatted_address || item.description,
      place_id: place.place_id,
      types: place.types
    });
  };

  // Debug: confirm mount/unmount. If we ever see mount on every tap, the
  // search bar is being unmounted — which would also blur the TextInput and
  // explain a dismiss.
  useEffect(() => {
    logger.log('dbg_search_mount', {
      mountId: mountIdRef.current,
      t: Date.now(),
    }, 'DBG');
    return () => logger.log('dbg_search_unmount', {
      mountId: mountIdRef.current,
      t: Date.now(),
    }, 'DBG');
  }, []);

  const handleFocus = () => {
    logger.log('dbg_search_onFocus', {
      mountId: mountIdRef.current,
      renderCount: renderCountRef.current,
      t: Date.now(),
    }, 'DBG');
    setIsFocused(true);
    setShowSuggestions(true);
    onFocusChange(true);
  };

  const handleBlur = () => {
    // Fire immediately. Suggestion taps work because the FlatList uses
    // keyboardShouldPersistTaps="handled", so the tap is delivered to the
    // suggestion row before the TextInput blurs.
    logger.log('dbg_search_onBlur', {
      mountId: mountIdRef.current,
      renderCount: renderCountRef.current,
      t: Date.now(),
    }, 'DBG');
    setIsFocused(false);
    if (!input) setShowSuggestions(false);
    onFocusChange(false);
  };

  // onEndEditing fires after native resignFirstResponder — if this fires
  // without us calling .blur() or Keyboard.dismiss(), it confirms the
  // resignation came from iOS (unmount, gesture steal, etc.).
  const handleEndEditing = () => {
    logger.log('dbg_search_onEndEditing', {
      mountId: mountIdRef.current,
      t: Date.now(),
    }, 'DBG');
  };

  // onLayout tells us when the native view's frame changes. If the TextInput's
  // width or height collapses to 0 (or near-0) during the focus cycle, iOS
  // will auto-resign first responder — which matches the symptom exactly.
  const handleInputLayout = (e) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    logger.log('dbg_search_inputLayout', {
      mountId: mountIdRef.current,
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
    }, 'DBG');
  };

  const handleContainerLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    logger.log('dbg_search_containerLayout', {
      mountId: mountIdRef.current,
      width: Math.round(width),
      height: Math.round(height),
    }, 'DBG');
  };

  const handleChangeText = (text) => {
    onChangeText(text);
    setShowSuggestions(text.length >= minChars);
  };

  // Return key: pick the top suggestion if we have one, otherwise just
  // dismiss the keyboard. `blurOnSubmit={false}` on the input means we
  // control the blur explicitly via handleSelect / Keyboard.dismiss.
  const handleSubmit = () => {
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
      return;
    }
    Keyboard.dismiss();
  };

  const clearInput = () => {
    onChangeText('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const showEmptyState =
    showSuggestions &&
    !loading &&
    !error &&
    input.length >= minChars &&
    suggestions.length === 0;

  return (
    <View style={[styles.container, containerStyle, style]}>
      <View
        onLayout={handleContainerLayout}
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
        ]}
      >
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={isFocused ? TOKENS.primary : TOKENS.textMuted}
        />

        <TextInput
          ref={inputRef}
          value={input}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onEndEditing={handleEndEditing}
          onSubmitEditing={handleSubmit}
          onLayout={handleInputLayout}
          style={styles.input}
          placeholderTextColor={TOKENS.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          blurOnSubmit={false}
          clearButtonMode="never"
          keyboardType="default"
          textContentType="fullStreetAddress"
          autoComplete="street-address"
          accessibilityLabel="Search address or place"
          accessibilityHint="Shows matching addresses as you type"
        />

        {/* fixed search container prevents layout shift when loading/clear appears */}
        <View style={styles.actionContainer}>
          {loading ? (
            <SearchLoadingDots />
          ) : input.length > 0 ? (
            <TouchableOpacity
              onPress={clearInput}
              style={styles.clearButton}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color={TOKENS.textMuted}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item, index }) => {
              const mainText = item.structured_formatting?.main_text
                || item.description.split(',')[0];
              const secondaryText = item.structured_formatting?.secondary_text
                || item.description.split(',').slice(1).join(',').trim();
              return (
                <TouchableOpacity
                  style={[
                    styles.suggestionItem,
                    index === 0 && styles.suggestionItemFirst,
                    index === suggestions.length - 1 && styles.suggestionItemLast
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={
                    secondaryText ? `${mainText}, ${secondaryText}` : mainText
                  }
                >
                  <View style={styles.suggestionIcon}>
                    <MaterialCommunityIcons
                      name={iconForTypes(item.types)}
                      size={18}
                      color={TOKENS.primary}
                    />
                  </View>

                  <View style={styles.suggestionText}>
                    <Text style={styles.mainText} numberOfLines={1}>
                      {mainText}
                    </Text>
                    <Text style={styles.secondaryText} numberOfLines={1}>
                      {secondaryText}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            style={styles.suggestionsList}
            nestedScrollEnabled
          />
        </View>
      )}

      {showEmptyState && (
        <View style={styles.emptyStateContainer} accessibilityLiveRegion="polite">
          <MaterialCommunityIcons
            name="map-search-outline"
            size={20}
            color={TOKENS.textMuted}
          />
          <Text style={styles.emptyStateText}>
            No matches — try a street or landmark
          </Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.errorContainer} accessibilityLiveRegion="polite">
          <Text style={styles.errorText}>{USER_ERROR_MESSAGE}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.hairline,
    // Android: react-native-maps draws via a SurfaceView. RN overlays above
    // the map need a positive `elevation` or touch events fail to route
    // through — the input can visually focus but keystrokes never land.
    // Keep the shadow muted on iOS so the visual stays minimal.
    elevation: 3,
  },

  inputContainerFocused: {
    borderColor: TOKENS.primary,
    // Thicker focus ring — hairline is too subtle against a map background.
    borderWidth: 1,
    backgroundColor: '#fff',
    shadowColor: TOKENS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    // Bumped above the base elevation (3) so focus state still layers higher.
    elevation: 4,
  },

  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: TOKENS.text,
    padding: 0,
    margin: 0,
    includeFontPadding: false,
  },

  actionContainer: {
    width: 34,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  loadingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: TOKENS.primary,
  },

  clearButton: {
    padding: 6,
    borderRadius: RADIUS.pill,
  },

  suggestionsContainer: {
    marginTop: 6,
    borderRadius: RADIUS.lg,
    backgroundColor: TOKENS.surface,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.hairline,
    maxHeight: 280,
    shadowColor: TOKENS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },

  suggestionsList: {
    flexGrow: 0,
  },

  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: TOKENS.surface,
  },

  suggestionItemFirst: {
    paddingTop: 16,
  },

  suggestionItemLast: {
    paddingBottom: 16,
  },

  suggestionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: TOKENS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  suggestionText: {
    flex: 1,
  },

  mainText: {
    fontSize: 15,
    fontWeight: '500',
    color: TOKENS.text,
    marginBottom: 3,
    lineHeight: 20,
  },

  secondaryText: {
    fontSize: 13,
    fontWeight: '400',
    color: TOKENS.textMuted,
    lineHeight: 18,
  },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: TOKENS.strokeLight,
    marginHorizontal: 16,
  },

  emptyStateContainer: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    backgroundColor: TOKENS.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.hairline,
  },

  emptyStateText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: TOKENS.textMuted,
    lineHeight: 18,
  },

  errorContainer: {
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: TOKENS.dangerSoft,
    borderWidth: 1,
    borderColor: alpha(TOKENS.danger, 0.18),
  },

  errorText: {
    fontSize: 13,
    fontWeight: '500',
    color: TOKENS.danger,
    textAlign: 'center',
    lineHeight: 18,
  },
});
