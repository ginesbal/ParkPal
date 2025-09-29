import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Alert, Animated } from 'react-native';
import { parkingAPI } from '../services/api';
import { calculateQuickInfo } from '../utils/parkingHelpers';

/**
 * Custom hook for managing parking spots data and related state
 * Handles API calls, animations, and data transformations
 */
export const useParkingSpots = ({ location, activeFilter, searchRadius }) => {
    // Core state
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(null);
    
    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(12)).current;
    
    // Calculate quick info stats
    const quickInfo = useMemo(() => {
        return calculateQuickInfo(spots);
    }, [spots]);
    
    // Load nearby spots
    const loadNearbySpots = useCallback(async () => {
        if (!location) return;
        
        try {
            setLoading(true);
            
            // Animate in content
            Animated.parallel([
                Animated.timing(fadeAnim, { 
                    toValue: 1, 
                    duration: 300, 
                    useNativeDriver: true 
                }),
                Animated.timing(slideAnim, { 
                    toValue: 0, 
                    duration: 300, 
                    useNativeDriver: true 
                })
            ]).start();
            
            // Build API parameters
            const params = activeFilter !== 'all' 
                ? { type: activeFilter } 
                : {};
            
            // Fetch spots from API
            const response = await parkingAPI.findNearbySpots(
                location.latitude,
                location.longitude,
                searchRadius,
                params
            );
            
            setSpots(response.data || []);
            setLastRefresh(new Date());
            
        } catch (error) {
            console.error('Error loading parking spots:', error);
            Alert.alert(
                'Connection Issue', 
                'Unable to load parking spots. Pull down to retry.'
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [location, activeFilter, searchRadius, fadeAnim, slideAnim]);
    
    // Handle refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadNearbySpots();
    }, [loadNearbySpots]);
    
    // Load spots when dependencies change
    useEffect(() => {
        if (location) {
            loadNearbySpots();
        }
    }, [location, activeFilter, searchRadius, loadNearbySpots]);
    
    return {
        spots,
        loading,
        refreshing,
        quickInfo,
        lastRefresh,
        onRefresh,
        fadeAnim,
        slideAnim
    };
};