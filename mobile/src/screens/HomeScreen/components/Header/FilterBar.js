
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getFilterIcon, getDistanceLabel } from '../../../../utils/parkingHelpers';
import { DEFAULT_SEARCH_RADIUS } from '../../../../constants/parking';
import { styles } from './styles';
import { TOKENS, PALETTE } from '../../../../constants/theme';

/**
 * FilterBar - Filter controls and active filter display
 */
const FilterBar = ({
    activeFilter,
    searchRadius,
    showFilters,
    toggleFilters,
    hasActiveFilters,
    lastRefresh
}) => {
    const filterCount = 
        (activeFilter !== 'all' ? 1 : 0) + 
        (searchRadius !== DEFAULT_SEARCH_RADIUS ? 1 : 0);
    
    return (
        <View style={styles.filterBar}>
            <View style={styles.filterLeft}>
                {/* Filter Toggle Button */}
                <TouchableOpacity 
                    style={styles.filterToggle} 
                    onPress={toggleFilters} 
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={`${showFilters ? 'Hide' : 'Show'} filters`}
                    accessibilityState={{ expanded: showFilters }}
                >
                    <MaterialCommunityIcons
                        name={showFilters ? 'tune-variant' : 'tune'}
                        size={18}
                        color={TOKENS.primary}
                    />
                    <Text style={styles.filterToggleText}>Filters</Text>
                    
                    {hasActiveFilters && (
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterBadgeText}>{filterCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Active Filter Chips */}
                {activeFilter !== 'all' && (
                    <View style={styles.activeFilterChip}>
                        <MaterialCommunityIcons
                            name={getFilterIcon(activeFilter)}
                            size={14}
                            color={PALETTE.flame?.[600] ?? TOKENS.primary}
                        />
                        <Text style={styles.activeFilterText}>
                            {activeFilter.replace('_', ' ')}
                        </Text>
                    </View>
                )}

                {searchRadius !== DEFAULT_SEARCH_RADIUS && (
                    <View style={styles.activeFilterChip}>
                        <Text style={styles.activeFilterText}>
                            {getDistanceLabel(searchRadius)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Last Update Time */}
            {lastRefresh && (
                <Text style={styles.updateText}>
                    Updated{' '}
                    {new Date(lastRefresh).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })}
                </Text>
            )}
        </View>
    );
};

export default FilterBar;