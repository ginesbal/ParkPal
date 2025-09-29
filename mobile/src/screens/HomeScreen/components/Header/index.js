import React from 'react';
import { Animated, View } from 'react-native';
import LocationSection from './LocationSection';
import QuickInfoBar from './QuickInfoBar';
import FilterBar from './FilterBar';
import ExpandableFilters from './ExpandableFilters';
import { styles } from './styles';

/**
 * Header Component - Contains location, quick info, and filters
 */
const Header = ({
    location,
    spots,
    quickInfo,
    activeFilter,
    setActiveFilter,
    searchRadius,
    setSearchRadius,
    showFilters,
    toggleFilters,
    filterHeight,
    hasActiveFilters,
    lastRefresh,
    fadeAnim,
    slideAnim,
    onLocationPress
}) => {
    return (
        <Animated.View
            style={[
                styles.header,
                { 
                    opacity: fadeAnim, 
                    transform: [{ translateY: slideAnim }] 
                }
            ]}
        >
            <View style={styles.mainHeader}>
                <LocationSection
                    locationName={location?.name || 'Downtown Calgary'}
                    onPress={onLocationPress}
                />
                
                {spots.length > 0 && (
                    <QuickInfoBar quickInfo={quickInfo} />
                )}
            </View>

            <FilterBar
                activeFilter={activeFilter}
                searchRadius={searchRadius}
                showFilters={showFilters}
                toggleFilters={toggleFilters}
                hasActiveFilters={hasActiveFilters}
                lastRefresh={lastRefresh}
            />

            <ExpandableFilters
                filterHeight={filterHeight}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                searchRadius={searchRadius}
                setSearchRadius={setSearchRadius}
            />
        </Animated.View>
    );
};

export default Header;
