import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

const TYPE_FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'on_street', label: 'Street' },
    { key: 'off_street', label: 'Lot' },
    { key: 'residential', label: 'Permit' },
];

const DISTANCE_OPTIONS = [150, 250, 500, 750, 1000];

const FilterBar = ({
    activeFilter,
    setActiveFilter,
    searchRadius,
    setSearchRadius,
}) => {
    const formatDistance = useCallback((meters) => {
        return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`;
    }, []);

    const handleFilterPress = useCallback((key) => {
        setActiveFilter?.(key);
    }, [setActiveFilter]);

    const handleDistancePress = useCallback((distance) => {
        setSearchRadius?.(distance);
    }, [setSearchRadius]);

    return (
        <View style={styles.filterBar}>
            <View style={styles.filterRow}>
                {TYPE_FILTERS.map((filter) => {
                    const isActive = activeFilter === filter.key;
                    return (
                        <TouchableOpacity
                            key={filter.key}
                            onPress={() => handleFilterPress(filter.key)}
                            style={[
                                styles.filterChip,
                                isActive && styles.filterChipActive
                            ]}
                            activeOpacity={0.6}
                        >
                            <Text style={[
                                styles.filterChipText,
                                isActive && styles.filterChipTextActive
                            ]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
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
                            <TouchableOpacity
                                key={distance}
                                style={[
                                    styles.distanceMarker,
                                    isActive && styles.distanceMarkerActive
                                ]}
                                onPress={() => handleDistancePress(distance)}
                                activeOpacity={0.6}
                            >
                                {isActive && (
                                    <Text style={styles.distanceValue}>
                                        {formatDistance(distance)}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

export default React.memo(FilterBar);