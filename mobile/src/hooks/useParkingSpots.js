import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Alert, Animated } from 'react-native';
import { parkingAPI } from '../services/api';
import { calculateQuickInfo } from '../utils/parkingHelpers';

export const useParkingSpots = ({ location, activeFilter, searchRadius }) => {
    // core state
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(null);
    
    // animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(12)).current;
    
    // calculate quick info stats
    const quickInfo = useMemo(() => {
        return calculateQuickInfo(spots);
    }, [spots]);
    
    // load nearby spots
    const loadNearbySpots = useCallback(async () => {
        if (!location) return;
        
        try {
            setLoading(true);
            
            // animate in content
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

            // build API parameters
            const params = activeFilter !== 'all'
                ? { type: activeFilter }
                : {};

            // fetch spots from API
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
    
    // handle refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadNearbySpots();
    }, [loadNearbySpots]);
    
    // load spots when dependencies change
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