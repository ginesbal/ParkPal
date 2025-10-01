
export const calculateQuickInfo = (spots) => {
    if (!spots || spots.length === 0) {
        return {
            total: 0,
            nearest: null,
            averagePrice: null
        };
    }

    // find nearest spot
    const nearest = spots.reduce(
        (min, spot) => (spot.distance < min.distance ? spot : min),
        spots[0]
    );

    // calculate average price
    const spotsWithPrice = spots.filter(s => s.price !== undefined && s.price > 0);
    const averagePrice = spotsWithPrice.length > 0
        ? spotsWithPrice.reduce((sum, s) => sum + parseFloat(s.price), 0) / spotsWithPrice.length
        : null;

    return {
        total: spots.length,
        nearest,
        averagePrice
    };
};

// format price for display
export const formatPrice = (price) => {
    if (!price || price === '0' || price === 0) return 'FREE';
    if (typeof price === 'number') return `$${price.toFixed(2)}`;
    return price;
};

// get icon name for filter
export const getFilterIcon = (filter) => {
    const icons = {
        'all': 'view-grid-outline',
        'on_street': 'car',
        'off_street': 'parking',
        'residential': 'home-city-outline'
    };
    return icons[filter] || 'help-circle';
};

// format distance label
export const getDistanceLabel = (meters) => {
    if (!meters && meters !== 0) return '—';
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
};


// calculate walking time from distance
export const calculateWalkingTime = (meters) => {
    if (!meters) return null;
    // average walking speed: 5 km/h
    const minutes = Math.round(meters / 83); // 83 meters per minute
    return minutes;
};

// sort spots by distance
export const sortByDistance = (spots) => {
    return [...spots].sort((a, b) => a.distance - b.distance);
};

// sort spots by price (free spots last)
export const sortByPrice = (spots) => {
    return [...spots].sort((a, b) => {
        if (!a.price) return 1;
        if (!b.price) return -1;
        return a.price - b.price;
    });
};

// filter free parking spots
export const filterFreeSpots = (spots) => {
    return spots.filter(spot => !spot.price || spot.price === 0);
};