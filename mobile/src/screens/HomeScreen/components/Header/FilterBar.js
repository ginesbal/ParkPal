import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
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
                        <Pressable
                            key={filter.key}
                            onPress={() => handleFilterPress(filter.key)}
                            style={({ pressed }) => [
                                styles.filterChip,
                                isActive && styles.filterChipActive,
                                pressed && styles.filterChipPressed,
                            ]}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isActive }}
                        >
                            <Text style={[
                                styles.filterChipText,
                                isActive && styles.filterChipTextActive
                            ]}>
                                {filter.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <View style={styles.distanceRow}>
                <Text style={styles.distanceLabel}>Radius</Text>
                <View style={styles.distanceOptions}>
                    {DISTANCE_OPTIONS.map((distance) => {
                        const isActive = searchRadius === distance;
                        return (
                            <Pressable
                                key={distance}
                                style={({ pressed }) => [
                                    styles.distanceOption,
                                    isActive && styles.distanceOptionActive,
                                    pressed && styles.distanceOptionPressed,
                                ]}
                                onPress={() => handleDistancePress(distance)}
                                accessibilityRole="button"
                                accessibilityState={{ selected: isActive }}
                            >
                                <Text style={[
                                    styles.distanceOptionText,
                                    isActive && styles.distanceOptionTextActive
                                ]}>
                                    {formatDistance(distance)}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

export default React.memo(FilterBar);
