module.exports = {
    CACHE_TTL: 300, // 5 minutes
    MAX_SEARCH_RADIUS: 5000, // 5km
    MAX_RESULTS: 50,

    PARKING_TYPES: ['on_street', 'off_street', 'residential', 'school'],

    PRICE_ZONES: {
        '1': 1.00,
        '2': 2.00,
        '3': 3.00,
        '4': 4.00,
        '5': 5.00
    },

    CALGARY_API: {
        BASE_URL: 'https://data.calgary.ca/resource',
        ENDPOINTS: {
            ON_STREET: '45az-7kh9.json',
            OFF_STREET: 'ggxk-g2u3.json',
            RESIDENTIAL: '2rmy-g65b.json',
            SCHOOL: '9hbw-zj92.json'
        }
    }
};