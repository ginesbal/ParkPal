export const centerCamera = async (mapRef, region, latitude, longitude, duration = 140) => {
    if (!mapRef?.current) return;
    try {
        const cam = await mapRef.current.getCamera();
        mapRef.current.animateCamera(
            { ...cam, center: { latitude, longitude } },
            { duration }
        );
    } catch {
        mapRef.current.animateToRegion(
            { ...region, latitude, longitude },
            duration
        );
    }
};

export const getMarkerScreenPosition = async (mapRef, spot) => {
    if (!mapRef?.current || !spot?.coordinates) return null;
    try {
        const coords = {
            latitude: spot.coordinates.coordinates[1],
            longitude: spot.coordinates.coordinates[0],
        };
        const screenPos = await mapRef.current.pointForCoordinate(coords);
        return screenPos;
    } catch (error) {
        console.error('Error getting marker position:', error);
        return null;
    }
};
