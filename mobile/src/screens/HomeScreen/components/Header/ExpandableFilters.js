import React from 'react';
import { Animated, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getFilterIcon, getDistanceLabel } from '../../../../utils/parkingHelpers';
import { FILTER_OPTIONS, DISTANCE_OPTIONS } from '../../../../constants/parking';
import { styles } from './styles';
import { TOKENS } from '../../../../constants/theme';

/**
 * ExpandableFilters - Collapsible filter options panel
 */
const ExpandableFilters = ({
    filterHeight,
    activeFilter,
    setActiveFilter,
    searchRadius,
    setSearchRadius
}) => {
    return (
        <Animated.View
            style={{
                maxHeight: filterHeight.interpolate({ 
                    inputRange: [0, 1], 
                    outputRange: [0, 200] 
                }),
                opacity: filterHeight,
                overflow: 'hidden'
            }}
        >
            <View style={styles.filterContent}>
                {/* Parking Type Filters */}
                <FilterGroup
                    label="Parking Type"
                    options={FILTER_OPTIONS}
                    activeValue={activeFilter}
                    onSelect={setActiveFilter}
                    renderIcon={(key) => (
                        <MaterialCommunityIcons
                            name={getFilterIcon(key)}
                            size={16}
                            color={activeFilter === key ? '#fff' : TOKENS.text}
                        />
                    )}
                />

                {/* Distance Filters */}
                <FilterGroup
                    label="Search Distance"
                    options={DISTANCE_OPTIONS}
                    activeValue={searchRadius}
                    onSelect={setSearchRadius}
                    renderLabel={(value) => getDistanceLabel(value)}
                    isDistance={true}
                />
            </View>
        </Animated.View>
    );
};

/**
 * FilterGroup - Reusable filter option group
 */
const FilterGroup = ({ 
    label, 
    options, 
    activeValue, 
    onSelect, 
    renderIcon, 
    renderLabel,
    isDistance = false 
}) => {
    return (
        <View style={styles.filterGroup}>
            <Text style={styles.filterGroupLabel}>{label}</Text>
            
            <View style={isDistance ? styles.distanceOptions : styles.filterOptions}>
                {options.map(option => {
                    const value = option.value || option.key;
                    const displayLabel = renderLabel 
                        ? renderLabel(value) 
                        : (option.label || value);
                    const isActive = activeValue === value;
                    
                    return (
                        <TouchableOpacity
                            key={value}
                            style={[
                                isDistance ? styles.distanceOption : styles.filterOption,
                                isActive && (isDistance 
                                    ? styles.distanceOptionActive 
                                    : styles.filterOptionActive)
                            ]}
                            onPress={() => onSelect(value)}
                            activeOpacity={0.9}
                            accessibilityRole="radio"
                            accessibilityLabel={`Select ${displayLabel}`}
                            accessibilityState={{ selected: isActive }}
                        >
                            {renderIcon && renderIcon(value)}
                            
                            <Text
                                style={[
                                    isDistance 
                                        ? styles.distanceOptionText 
                                        : styles.filterOptionText,
                                    isActive && (isDistance 
                                        ? styles.distanceOptionTextActive 
                                        : styles.filterOptionTextActive)
                                ]}
                            >
                                {displayLabel}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default ExpandableFilters;