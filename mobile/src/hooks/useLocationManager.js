import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { DEFAULT_LOCATION, LOCATION_STORAGE_KEY } from '../constants/parking';

/**
 * Custom hook for managing user location
 * Handles permissions, storage, and updates
 */
export const useLocationManager = () => {
    const [location, setLocation] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);
    const [locationError, setLocationError] = useState(null);
    const [locationName, setLocationName] = useState('Loading...');
    
    // Load location from storage or get current
    const loadLocation = useCallback(async () => {
        try {
            setIsLoadingLocation(true);
            
            // First, try to load from storage
            const stored = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
            if (stored) {
                const parsedLocation = JSON.parse(stored);
                setLocation(parsedLocation);
                setLocationName(parsedLocation.name || 'Downtown Calgary');
                setIsLoadingLocation(false);
                return;
            }
            
            // Request permission if not stored
            const { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                // Use default location if permission denied
                setLocation(DEFAULT_LOCATION);
                setLocationName(DEFAULT_LOCATION.name);
                setLocationError('Location permission denied. Using default location.');
            } else {
                // Get current location
                const currentLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced
                });
                
                const newLocation = {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                    name: 'Current Location'
                };
                
                // Try to get address
                try {
                    const [address] = await Location.reverseGeocodeAsync({
                        latitude: newLocation.latitude,
                        longitude: newLocation.longitude
                    });
                    
                    if (address) {
                        newLocation.name = address.district || address.city || 'Current Location';
                    }
                } catch (error) {
                    console.log('Reverse geocoding failed:', error);
                }
                
                setLocation(newLocation);
                setLocationName(newLocation.name);
                
                // Save to storage
                await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(newLocation));
            }
        } catch (error) {
            console.error('Error loading location:', error);
            setLocationError('Failed to load location. Using default.');
            setLocation(DEFAULT_LOCATION);
            setLocationName(DEFAULT_LOCATION.name);
        } finally {
            setIsLoadingLocation(false);
        }
    }, []);
    
    // Update location
    const updateLocation = useCallback(async (newLocation) => {
        setLocation(newLocation);
        setLocationName(newLocation.name || 'Selected Location');
        await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(newLocation));
    }, []);
    
    // Initial load
    useEffect(() => {
        loadLocation();
    }, [loadLocation]);
    
    return {
        location,
        locationName,
        isLoadingLocation,
        locationError,
        updateLocation,
        refreshLocation: loadLocation
    };
};