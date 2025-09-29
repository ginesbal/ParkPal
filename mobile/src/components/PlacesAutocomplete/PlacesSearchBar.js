// Redesigned PlacesSearchBar.js - Modern, non-overlapping search component

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useEffect } from 'react';
import { 
  FlatList, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  ActivityIndicator,
  Animated,
  Keyboard,
  Platform,
  Pressable
} from 'react-native';
import usePlacesAutocomplete from '../../hooks/usePlacesAutocomplete';
import { TOKENS, PALETTE, alpha } from '../../constants/theme';

// API fetchers remain the same
const devDirectFetcher = async ({ url, params }) => {
  const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY;
  if (!API_KEY) throw new Error('Missing EXPO_PUBLIC_GOOGLE_PLACES_KEY in .env');

  const base = url === 'autocomplete'
    ? 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
    : 'https://maps.googleapis.com/maps/api/place/details/json';

  const qs = new URLSearchParams({ key: API_KEY, ...params }).toString();
  const resp = await fetch(`${base}?${qs}`);
  const json = await resp.json();

  if (json.status && json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Places: ${json.status} ${json.error_message || ''}`);
  }
  return json;
};

const productionFetcher = async ({ url, params }) => {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
  const endpoint = url === 'autocomplete' 
    ? '/api/places/autocomplete' 
    : '/api/places/details';
  
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${baseUrl}${endpoint}?${queryString}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch places');
  }
  
  return response.json();
};

export default function PlacesSearchBar({
  onPlaceSelected = () => {},
  onFocusChange = () => {},
  containerStyle = {},
  fetcher = __DEV__ ? devDirectFetcher : productionFetcher,
  components = 'country:ca',
  placeholder = 'Search location',
  minChars = 2,
  debounceMs = 250,
}) {
  const inputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;
  
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

  // Animate dropdown appearance
  useEffect(() => {
    if (suggestions.length > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -10,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [suggestions.length]);

  const handleSelect = async (item) => {
    const place = await selectPrediction(item);
    if (!place?.geometry?.location) return;
    
    // Clear input and dismiss keyboard
    onChangeText('');
    Keyboard.dismiss();
    inputRef.current?.blur();
    onFocusChange(false);
    
    const { lat, lng } = place.geometry.location;
    onPlaceSelected({
      lat, 
      lng, 
      name: place.name,
      address: place.formatted_address, 
      place_id: place.place_id, 
      types: place.types,
    });
  };

  const clearSearch = () => {
    onChangeText('');
    inputRef.current?.focus();
  };

  // Get place type icon
  const getPlaceIcon = (types) => {
    if (!types || !Array.isArray(types)) return 'map-marker';
    
    if (types.includes('restaurant')) return 'silverware-fork-knife';
    if (types.includes('cafe')) return 'coffee';
    if (types.includes('park')) return 'tree';
    if (types.includes('parking')) return 'parking';
    if (types.includes('gas_station')) return 'gas-station';
    if (types.includes('shopping_mall')) return 'shopping';
    if (types.includes('grocery_or_supermarket')) return 'cart';
    if (types.includes('hospital')) return 'hospital-box';
    if (types.includes('school')) return 'school';
    if (types.includes('bank')) return 'bank';
    if (types.includes('lodging')) return 'bed';
    if (types.includes('transit_station')) return 'train';
    if (types.includes('airport')) return 'airplane';
    return 'map-marker';
  };

  // Parse structured formatting for better display
  const parseDescription = (item) => {
    if (item.structured_formatting) {
      return {
        main: item.structured_formatting.main_text,
        secondary: item.structured_formatting.secondary_text,
      };
    }
    const parts = item.description.split(',');
    return {
      main: parts[0],
      secondary: parts.slice(1).join(',').trim(),
    };
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.searchBar}>
        <MaterialCommunityIcons 
          name="magnify" 
          size={20} 
          color={TOKENS.textMuted} 
          style={styles.searchIcon}
        />
        
        <TextInput
          ref={inputRef}
          value={input}
          placeholder={placeholder}
          onChangeText={onChangeText}
          onFocus={() => onFocusChange(true)}
          onBlur={() => setTimeout(() => onFocusChange(false), 200)}
          style={styles.input}
          placeholderTextColor={TOKENS.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="never" // We'll use custom clear button
        />
        
        {/* Loading or Clear button */}
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={TOKENS.primary} 
            style={styles.rightIcon}
          />
        ) : input.length > 0 ? (
          <Pressable 
            onPress={clearSearch}
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.clearButtonPressed
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons 
              name="close-circle" 
              size={18} 
              color={TOKENS.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <Animated.View 
          style={[
            styles.dropdown,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={suggestions.slice(0, 5)} // Limit to 5 results for cleaner UI
            keyExtractor={(item) => item.place_id}
            renderItem={({ item, index }) => {
              const { main, secondary } = parseDescription(item);
              const isLast = index === Math.min(suggestions.length - 1, 4);
              
              return (
                <Pressable 
                  style={({ pressed }) => [
                    styles.suggestionItem,
                    pressed && styles.suggestionItemPressed,
                    isLast && styles.suggestionItemLast
                  ]} 
                  onPress={() => handleSelect(item)}
                >
                  <View style={styles.suggestionIcon}>
                    <MaterialCommunityIcons 
                      name={getPlaceIcon(item.types)} 
                      size={18} 
                      color={PALETTE.straw.DEFAULT}
                    />
                  </View>
                  
                  <View style={styles.suggestionText}>
                    <Text 
                      numberOfLines={1} 
                      style={styles.suggestionMain}
                    >
                      {main}
                    </Text>
                    {secondary && (
                      <Text 
                        numberOfLines={1} 
                        style={styles.suggestionSecondary}
                      >
                        {secondary}
                      </Text>
                    )}
                  </View>
                  
                  <MaterialCommunityIcons 
                    name="arrow-top-left" 
                    size={16} 
                    color={TOKENS.textMuted}
                    style={styles.suggestionArrow}
                  />
                </Pressable>
              );
            }}
          />
          
          {suggestions.length > 5 && (
            <View style={styles.moreResults}>
              <Text style={styles.moreResultsText}>
                {suggestions.length - 5} more results
              </Text>
            </View>
          )}
        </Animated.View>
      )}

      {/* Error state */}
      {error && !loading && (
        <Animated.View 
          style={[
            styles.errorContainer,
            { opacity: fadeAnim }
          ]}
        >
          <MaterialCommunityIcons 
            name="alert-circle" 
            size={14} 
            color="#ef4444"
          />
          <Text style={styles.errorText}>
            Unable to search. Please try again.
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 22,
    paddingHorizontal: 12,
    height: 44,
  },
  
  searchIcon: {
    marginRight: 8,
  },
  
  input: {
    flex: 1,
    fontSize: 14,
    color: TOKENS.text,
    paddingVertical: 0, // Remove default padding
    height: '100%',
  },
  
  rightIcon: {
    marginLeft: 8,
  },
  
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  
  clearButtonPressed: {
    opacity: 0.5,
  },
  
  dropdown: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: 280,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: PALETTE.vanilla[700],
  },
  
  suggestionItemPressed: {
    backgroundColor: alpha(PALETTE.vanilla[700], 0.3),
  },
  
  suggestionItemLast: {
    borderBottomWidth: 0,
  },
  
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: alpha(PALETTE.straw.DEFAULT, 0.1),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  
  suggestionText: {
    flex: 1,
    marginRight: 8,
  },
  
  suggestionMain: {
    fontSize: 14,
    fontWeight: '600',
    color: TOKENS.text,
    marginBottom: 2,
  },
  
  suggestionSecondary: {
    fontSize: 12,
    color: TOKENS.textMuted,
  },
  
  suggestionArrow: {
    opacity: 0.4,
  },
  
  moreResults: {
    padding: 8,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: PALETTE.vanilla[700],
    backgroundColor: alpha(PALETTE.vanilla[700], 0.2),
  },
  
  moreResultsText: {
    fontSize: 11,
    color: TOKENS.textMuted,
    fontWeight: '600',
  },
  
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    flex: 1,
  },
});