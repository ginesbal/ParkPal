import { useEffect, useRef, useState } from 'react';
import { parkingAPI } from '../services/api';

export function useParkingSpots(location, radius, filterType = 'all') {
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // track if component is mounted to prevent state updates after unmount
    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        // do not fetch if no location
        if (!location?.latitude || !location?.longitude) {
            return;
        }

        let timeoutId;

        const fetchSpots = async () => {
            if (!isMountedRef.current) return;

            setLoading(true);
            setError(null);

            try {
                const params = filterType !== 'all' ? { type: filterType } : {};
                const response = await parkingAPI.findNearbySpots(
                    location.latitude,
                    location.longitude,
                    radius,
                    params
                );

                if (isMountedRef.current) {
                    setSpots(response?.data || []);
                }
            } catch (err) {
                if (isMountedRef.current) {
                    setError(err.message || 'Failed to load parking spots');
                    setSpots([]);
                }
            } finally {
                if (isMountedRef.current) {
                    setLoading(false);
                }
            }
        };

        // debounce the API call by 300ms
        timeoutId = setTimeout(() => {
            fetchSpots();
        }, 300);

        // cleanup: cancel the timeout if dependencies change
        return () => {
            clearTimeout(timeoutId);
        };
    }, [location?.latitude, location?.longitude, radius, filterType]);

    return { spots, loading, error };
}   