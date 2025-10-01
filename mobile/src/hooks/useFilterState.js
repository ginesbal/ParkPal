import { useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { DEFAULT_SEARCH_RADIUS } from '../constants/parking';

export const useFilterState = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchRadius, setSearchRadius] = useState(DEFAULT_SEARCH_RADIUS);
    const [showFilters, setShowFilters] = useState(false);

    // animation for expandable filters
    const filterHeight = useRef(new Animated.Value(0)).current;

    // check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return activeFilter !== 'all' || searchRadius !== DEFAULT_SEARCH_RADIUS;
    }, [activeFilter, searchRadius]);

    // count active filters for badge
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (activeFilter !== 'all') count++;
        if (searchRadius !== DEFAULT_SEARCH_RADIUS) count++;
        return count;
    }, [activeFilter, searchRadius]);

    // toggle filter expansion
    const toggleFilters = () => {
        const toValue = showFilters ? 0 : 1;
        setShowFilters(!showFilters);

        Animated.spring(filterHeight, {
            toValue,
            tension: 65,
            friction: 9,
            useNativeDriver: false,
        }).start();
    };

    // reset all filters
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
        resetFilters,
    };
};
