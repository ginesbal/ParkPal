import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { PALETTE, TOKENS, alpha } from '../../constants/theme';
import usePlacesAutocomplete from '../../hooks/usePlacesAutocomplete';

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

export default function PlacesSearchBar({
  onPlaceSelected = () => { },
  onFocusChange = () => { },
  shouldDismiss = false,
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

  useEffect(() => {
    if (shouldDismiss && isFocused) {
      inputRef.current?.blur();
      setIsFocused(false);
      setShowSuggestions(false);
      onFocusChange(false);
    }
  }, [shouldDismiss, isFocused, onFocusChange]);

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

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
    onFocusChange(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      if (!input) {
        setShowSuggestions(false);
      }
      onFocusChange(false);
    }, 200);
  };

  const handleChangeText = (text) => {
    onChangeText(text);
    setShowSuggestions(text.length >= minChars);
  };

  const clearInput = () => {
    onChangeText('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused
      ]}>
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
          style={styles.input}
          placeholderTextColor={TOKENS.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="never"
        />

        {/* fixed search container prevents layout shift when loading/clear appears */}
        <View style={styles.actionContainer}>
          {loading ? (
            <ActivityIndicator size="small" color={TOKENS.primary} />
          ) : input.length > 0 ? (
            <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
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
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.suggestionItem,
                  index === 0 && styles.suggestionItemFirst,
                  index === suggestions.length - 1 && styles.suggestionItemLast
                ]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <View style={styles.suggestionIcon}>
                  <MaterialCommunityIcons
                    name={
                      item.types?.includes('airport') ? 'airplane' :
                        item.types?.includes('establishment') ? 'domain' :
                          'map-marker'
                    }
                    size={18}
                    color={TOKENS.primary}
                  />
                </View>

                <View style={styles.suggestionText}>
                  <Text style={styles.mainText} numberOfLines={1}>
                    {item.structured_formatting?.main_text || item.description.split(',')[0]}
                  </Text>
                  <Text style={styles.secondaryText} numberOfLines={1}>
                    {item.structured_formatting?.secondary_text ||
                      item.description.split(',').slice(1).join(',')}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            style={styles.suggestionsList}
            nestedScrollEnabled
          />
        </View>
      )}

      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error.message || 'Search failed'}
          </Text>
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
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
    borderWidth: 1,
    borderColor: PALETTE.vanilla[700],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  inputContainerFocused: {
    borderColor: alpha(TOKENS.primary, 0.4),
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
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
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  clearButton: {
    padding: 5,
    borderRadius: 12,
  },

  suggestionsContainer: {
    marginTop: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: PALETTE.vanilla[700],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
    maxHeight: 280,
  },

  suggestionsList: {
    flexGrow: 0,
  },

  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
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
    borderRadius: 18,
    backgroundColor: alpha(TOKENS.primary, 0.08),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  suggestionText: {
    flex: 1,
  },

  mainText: {
    fontSize: 15,
    fontWeight: '600',
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
    backgroundColor: PALETTE.vanilla[700],
    marginHorizontal: 16,
  },

  errorContainer: {
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: alpha('#dc2626', 0.08),
    borderWidth: 1,
    borderColor: alpha('#dc2626', 0.2),
  },

  errorText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#dc2626',
    textAlign: 'center',
    lineHeight: 18,
  },
});