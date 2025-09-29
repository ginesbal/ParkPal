require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());
const axios = require('axios');
// Database setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// Health check
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'healthy', message: 'Database connected' });
    } catch (error) {
        res.status(503).json({ status: 'unhealthy', error: error.message });
    }
});

// Find nearby parking - SIMPLIFIED WITHOUT CHECK_INS
app.get('/api/parking/nearby', async (req, res) => {
    try {
        const { lat, lng, radius = 500, type, free } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'lat and lng required' });
        }

        // Build query with filters
        let whereConditions = [`ST_DWithin(location, ST_MakePoint($2, $1)::geography, $3)`];
        
        if (type && type !== 'all') {
            whereConditions.push(`spot_type = '${type}'`);
        }
        
        if (free === 'true') {
            whereConditions.push(`(price_zone IS NULL OR price_zone = '0' OR price_zone = '')`);
        }

        const whereClause = whereConditions.join(' AND ');

        const result = await pool.query(`
            SELECT 
                id,
                spot_type,
                address_desc,
                permit_zone,
                price_zone,
                html_zone_rate,
                block_side,
                enforceable_time,
                zone_cap,
                zone_length,
                seg_cap,
                seg_length,
                max_time,
                zone_type,
                parking_restrict_type,
                parking_restrict_time,
                lot_name,
                parking_type,
                lot_num,
                home_page,
                description,
                parking_zone,
                ctp_class,
                dot,
                parking_restriction,
                time_restriction,
                no_stopping,
                octant,
                stall_type,
                camera,
                ST_Distance(location, ST_MakePoint($2, $1)::geography) as distance,
                ST_AsGeoJSON(location)::json as coordinates
            FROM parking_spots
            WHERE ${whereClause}
            ORDER BY distance
            LIMIT 100
        `, [lat, lng, radius]);

        console.log(`Found ${result.rows.length} parking spots within ${radius}m of (${lat}, ${lng})`);

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows.map(spot => ({
                id: spot.id,
                spot_type: spot.spot_type,
                address: spot.address_desc || 'Unknown Address',
                coordinates: spot.coordinates,
                distance: Math.round(spot.distance),
                walkingTime: Math.ceil(spot.distance / 80), // 80m/min walking speed
                
                // Capacity - use zone_cap or seg_cap
                capacity: spot.zone_cap || spot.seg_cap || 0,
                available: spot.zone_cap || spot.seg_cap || 0, // Assume all available for now
                
                // Zone information
                zone_info: {
                    permit_zone: spot.permit_zone,
                    price_zone: spot.price_zone,
                    html_zone_rate: spot.html_zone_rate,
                    zone_type: spot.zone_type,
                    parking_zone: spot.parking_zone,
                    enforceable_time: spot.enforceable_time
                },
                
                // Metadata
                metadata: {
                    stall_type: spot.stall_type,
                    camera: spot.camera,
                    block_side: spot.block_side,
                    max_time: spot.max_time,
                    zone_cap: spot.zone_cap,
                    seg_cap: spot.seg_cap,
                    lot_name: spot.lot_name,
                    lot_num: spot.lot_num,
                    parking_type: spot.parking_type,
                    home_page: spot.home_page,
                    time_restriction: spot.time_restriction,
                    parking_restriction: spot.parking_restriction,
                    no_stopping: spot.no_stopping,
                    description: spot.description,
                    ctp_class: spot.ctp_class,
                    dot: spot.dot,
                    octant: spot.octant
                },
                
                // Calculate basic price from price_zone
                price_per_hour: spot.price_zone ? 
                    {
                        '1': 1.00,
                        '2': 2.00,
                        '3': 3.00,
                        '4': 4.00,
                        '5': 5.00,
                        '6': 6.00
                    }[spot.price_zone] || 0 : 0,
                
                max_duration_minutes: spot.max_time ? parseFloat(spot.max_time) : null
            }))
        });
    } catch (error) {
        console.error('Error in nearby endpoint:', error);
        res.status(500).json({ 
            success: false,
            error: error.message,
            details: error.detail || 'Unknown error'
        });
    }
});

// Get parking spot details
app.get('/api/parking/spot/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(`
            SELECT 
                *,
                ST_AsGeoJSON(location)::json as coordinates
            FROM parking_spots
            WHERE id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Spot not found' });
        }
        
        res.json({ 
            success: true, 
            data: result.rows[0] 
        });
    } catch (error) {
        console.error('Error getting spot details:', error);
        res.status(500).json({ error: error.message });
    }
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) as count FROM parking_spots');
        res.json({ 
            success: true, 
            totalSpots: result.rows[0].count,
            message: `Database has ${result.rows[0].count} parking spots`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PLACEHOLDER endpoints for check-in (will implement later)
app.post('/api/parking/checkin', async (req, res) => {
    res.json({ 
        success: false, 
        message: 'Check-in feature coming soon',
        placeholder: true 
    });
});

app.post('/api/parking/checkout', async (req, res) => {
    res.json({ 
        success: false, 
        message: 'Checkout feature coming soon',
        placeholder: true 
    });
});

app.get('/api/places/autocomplete', async (req, res) => {
    try {
        const { input, components, sessiontoken } = req.query;
        
        if (!input) {
            return res.status(400).json({ error: 'Input parameter required' });
        }

        const params = {
            input,
            key: process.env.GOOGLE_PLACES_API_KEY,
            components: components || 'country:ca',
            sessiontoken: sessiontoken || ''
        };

        const response = await axios.get(
            'https://maps.googleapis.com/maps/api/place/autocomplete/json',
            { params }
        );
        
        console.log('Places autocomplete response:', response.data.status);
        res.json(response.data);
        
    } catch (error) {
        console.error('Places autocomplete error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Google Places Details Proxy  
app.get('/api/places/details', async (req, res) => {
    try {
        const { place_id, sessiontoken, fields } = req.query;
        
        if (!place_id) {
            return res.status(400).json({ error: 'place_id required' });
        }

        const params = {
            place_id,
            key: process.env.GOOGLE_PLACES_API_KEY,
            fields: fields || 'geometry,formatted_address,name,place_id,types',
            sessiontoken: sessiontoken || ''
        };

        const response = await axios.get(
            'https://maps.googleapis.com/maps/api/place/details/json',
            { params }
        );
        
        console.log('Places details response:', response.data.status);
        res.json(response.data);
        
    } catch (error) {
        console.error('Places details error:', error.message);
        res.status(500).json({ error: error.message });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Test DB: http://localhost:${PORT}/api/test-db`);
    console.log(`Test nearby: http://localhost:${PORT}/api/parking/nearby?lat=51.0447&lng=-114.0719&radius=1000`);
});