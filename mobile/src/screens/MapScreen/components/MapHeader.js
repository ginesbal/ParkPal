import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
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

const DISTANCE_OPTIONS = [150, 250, 500, 750, 1000];

function MapHeader({
    shouldDismissSearch,
    isSearchFocused,
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
    const formatDistance = useCallback((meters) => {
        return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`;
    }, []);

    const handleFilterPress = useCallback((type) => {
        setFilterType(type);
    }, [setFilterType]);

    const handleDistancePress = useCallback((distance) => {
        setSearchRadius(distance);
    }, [setSearchRadius]);
    return (
        <>
            <View style={styles.searchSection}>
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
                            >
                                <MaterialCommunityIcons
                                    name="map-marker"
                                    size={18}
                                    color={searchMode === 'pinned' ? '#fff' : PALETTE.flame[500]}
                                />
                            </Pressable>
                        ) : (
                            <Pressable
                                style={({ pressed }) => [
                                    styles.quickAction,
                                    pressed && styles.quickActionPressed
                                ]}
                                onPress={() => setShowPinInstructions(!showPinInstructions)}
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

            <Animated.View
                style={[
                    styles.filterBar,
                    { opacity: isSearchFocused ? 0.3 : 1 }
                ]}
                pointerEvents={isSearchFocused ? 'none' : 'auto'}
            >
                <View style={styles.filterRow}>
                    {TYPE_FILTERS.map(f => (
                        <Pressable
                            key={f.type}
                            style={[
                                styles.filterChip,
                                filterType === f.type && styles.filterChipActive,
                            ]}
                            onPress={() => handleFilterPress(f.type)}
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

                <View style={styles.distanceRow}>
                    <MaterialCommunityIcons
                        name="map-marker-distance"
                        size={14}
                        color="#999"
                    />
                    <View style={styles.distanceTrack}>
                        {DISTANCE_OPTIONS.map((distance) => {
                            const isActive = searchRadius === distance;
                            return (
                                <Pressable
                                    key={distance}
                                    style={[
                                        styles.distanceMarker,
                                        isActive && styles.distanceMarkerActive
                                    ]}
                                    onPress={() => handleDistancePress(distance)}
                                >
                                    {isActive && (
                                        <Text style={styles.distanceValue}>
                                            {formatDistance(distance)}
                                        </Text>
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </Animated.View>
        </>
    );
}

export default React.memo(MapHeader);