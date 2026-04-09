import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo, useCallback } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import PlacesSearchBar from '../../../components/PlacesAutocomplete/PlacesSearchBar';
import { PALETTE, TOKENS } from '../../../constants/theme';
import { styles } from '../styles';

const TYPE_FILTERS = [
    { type: 'all', label: 'All' },
    { type: 'on_street', label: 'Street' },
    { type: 'off_street', label: 'Lot' },
    { type: 'residential', label: 'Permit' },
];

const DISTANCE_PRESETS = [
    { value: 150, label: '150 m' },
    { value: 500, label: '500 m' },
    { value: 1000, label: '1 km' }
];

function MapHeader({
    shouldDismissSearch,
    isSearchFocused,
    isDetailActive,
    setIsSearchFocused,
    pinnedLocation,
    showPinInstructions,
    setShowPinInstructions,
    searchMode,
    setSearchMode,
    filterType,
    setFilterType,
    searchRadius,
    setSearchRadius,
    onPlaceSelected,
}) {
    const handleFilterPress = useCallback((type) => {
        setFilterType(type);
    }, [setFilterType]);

    const handleDistancePress = useCallback((distance) => {
        setSearchRadius(distance);
    }, [setSearchRadius]);
    return (
        <>
            <View
                style={[
                    styles.searchSection,
                    isDetailActive && styles.searchSectionCompact,
                    isDetailActive && styles.searchSectionStandalone,
                ]}
            >
                {!isDetailActive && (
                    <View style={styles.searchMetaRow}>
                        <View style={styles.searchModePill}>
                            <MaterialCommunityIcons
                                name={searchMode === 'pinned' ? 'map-marker' : 'crosshairs-gps'}
                                size={14}
                                color={searchMode === 'pinned' ? TOKENS.primaryAlt : TOKENS.textMuted}
                            />
                            <Text style={styles.searchModeText}>
                                {searchMode === 'pinned' ? 'Pinned search area' : 'Searching near you'}
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.searchInputRow}>
                    <PlacesSearchBar
                        shouldDismiss={shouldDismissSearch}
                        onPlaceSelected={onPlaceSelected}
                        onFocusChange={setIsSearchFocused}
                        style={styles.searchContainer}
                    />

                    {!isSearchFocused && (
                        <View style={styles.quickActions}>
                            {pinnedLocation ? (
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.quickAction,
                                        searchMode === 'pinned' && styles.quickActionActive,
                                        pressed && styles.quickActionPressed
                                    ]}
                                    onPress={() => setSearchMode(searchMode === 'pinned' ? 'current' : 'pinned')}
                                    accessibilityRole="button"
                                    accessibilityLabel={searchMode === 'pinned' ? 'Switch back to current location' : 'Use pinned search area'}
                                >
                                    <MaterialCommunityIcons
                                        name="map-marker"
                                        size={18}
                                        color={searchMode === 'pinned' ? '#fff' : PALETTE.cerulean[500]}
                                    />
                                </Pressable>
                            ) : (
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.quickAction,
                                        pressed && styles.quickActionPressed
                                    ]}
                                    onPress={() => setShowPinInstructions(!showPinInstructions)}
                                    accessibilityRole="button"
                                    accessibilityLabel="Show map pin instructions"
                                >
                                    <MaterialCommunityIcons
                                        name="map-marker-plus"
                                        size={18}
                                        color={TOKENS.text}
                                    />
                                </Pressable>
                            )}
                        </View>
                    )}
                </View>
            </View>

            {!isDetailActive && (
                <Animated.View
                    style={[
                        styles.filterBar,
                        { opacity: isSearchFocused ? 0.3 : 1 }
                    ]}
                    pointerEvents={isSearchFocused ? 'none' : 'auto'}
                >
                    <View style={styles.controlGroup}>
                        <Text style={styles.controlLabel}>Spot type</Text>
                        <View style={styles.filterRow}>
                            {TYPE_FILTERS.map(f => (
                                <Pressable
                                    key={f.type}
                                    style={({ pressed }) => [
                                        styles.filterChip,
                                        filterType === f.type && styles.filterChipActive,
                                        pressed && styles.filterChipPressed,
                                    ]}
                                    onPress={() => handleFilterPress(f.type)}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected: filterType === f.type }}
                                >
                                    <Text style={[
                                        styles.filterChipText,
                                        filterType === f.type && styles.filterChipTextActive
                                    ]}>
                                        {f.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View style={styles.controlGroup}>
                        <Text style={styles.controlLabel}>Search radius</Text>
                        <View style={styles.distanceRow}>
                            <View style={styles.distanceSegmented}>
                                {DISTANCE_PRESETS.map((preset) => (
                                    <Pressable
                                        key={preset.value}
                                        style={({ pressed }) => [
                                            styles.distanceSegment,
                                            searchRadius === preset.value && styles.distanceSegmentActive,
                                            pressed && styles.distanceSegmentPressed,
                                        ]}
                                        onPress={() => handleDistancePress(preset.value)}
                                        accessibilityRole="button"
                                        accessibilityState={{ selected: searchRadius === preset.value }}
                                    >
                                        <Text style={[
                                            styles.distanceSegmentText,
                                            searchRadius === preset.value && styles.distanceSegmentTextActive
                                        ]}>
                                            {preset.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    </View>
                </Animated.View>
            )}
        </>
    );
}

export default memo(MapHeader);
