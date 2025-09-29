import { useState, useRef, useMemo } from 'react';
import { Animated } from 'react-native';
import { DEFAULT_SEARCH_RADIUS } from '../constants/parking';

/**
 * Custom hook for managing filter state and animations
 */
export const useFilterState = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchRadius, setSearchRadius] = useState(DEFAULT_SEARCH_RADIUS);
    const [showFilters, setShowFilters] = useState(false);
    
    // Animation for expandable filters
    const filterHeight = useRef(new Animated.Value(0)).current;
    
    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return activeFilter !== 'all' || searchRadius !== DEFAULT_SEARCH_RADIUS;
    }, [activeFilter, searchRadius]);
    
    // Count active filters for badge
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (activeFilter !== 'all') count++;
        if (searchRadius !== DEFAULT_SEARCH_RADIUS) count++;
        return count;
    }, [activeFilter, searchRadius]);
    
    // Toggle filter expansion
    const toggleFilters = () => {
        const toValue = showFilters ? 0 : 1;
        setShowFilters(!showFilters);
        
        Animated.spring(filterHeight, {
            toValue,
            tension: 65,
            friction: 9,
            useNativeDriver: false
        }).start();
    };
    
    // Reset all filters
    const resetFilters = () => {
        setActiveFilter('all');
        setSearchRadius(DEFAULT_SEARCH_RADIUS);
        if (showFilters) toggleFilters();
    };
    
    return {
        activeFilter,
        setActiveFilter,
        searchRadius,
        setSearchRadius,
        showFilters,
        toggleFilters,
        filterHeight,
        hasActiveFilters,
        activeFilterCount,
        resetFilters
    };
};