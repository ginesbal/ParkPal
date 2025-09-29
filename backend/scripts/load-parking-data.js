require('dotenv').config();
const axios = require('axios');
const { Pool } = require('pg');

async function loadParkingData() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    console.log('Loading Calgary parking data...\n');

    const datasets = [
        { type: 'on_street', endpoint: '45az-7kh9.json', limit: 100 },
        { type: 'off_street', endpoint: 'ggxk-g2u3.json', limit: 50 },
        { type: 'residential', endpoint: '2rmy-g65b.json', limit: 50 },
        { type: 'school', endpoint: '9hbw-zj92.json', limit: 50 }
    ];

    let totalLoaded = 0;

    for (const dataset of datasets) {
        console.log(`\nLoading ${dataset.type} parking...`);

        try {
            const response = await axios.get(
                `https://data.calgary.ca/resource/${dataset.endpoint}`,
                {
                    params: {
                        $limit: dataset.limit,
                        $$app_token: process.env.CALGARY_API_TOKEN
                    }
                }
            );

            let loaded = 0;

            for (const record of response.data) {
                try {
                    let lng, lat;

                    // Extract coordinates based on type
                    if (dataset.type === 'off_street' && record.multipolygon?.coordinates) {
                        // Get centroid of parking lot
                        const polygon = record.multipolygon.coordinates[0][0];
                        lng = polygon.reduce((sum, pt) => sum + pt[0], 0) / polygon.length;
                        lat = polygon.reduce((sum, pt) => sum + pt[1], 0) / polygon.length;
                    } else if (record.the_geom?.coordinates?.[0]?.[0]) {
                        [lng, lat] = record.the_geom.coordinates[0][0];
                    } else if (record.line?.coordinates?.[0]?.[0]) {
                        [lng, lat] = record.line.coordinates[0][0];
                    } else {
                        continue;
                    }

                    // Price mapping
                    const priceMap = {
                        '1': 1.00, '2': 2.00, '3': 3.00,
                        '4': 4.00, '5': 5.00, 'P1': 1.50,
                        'P2': 2.50, 'P3': 3.50
                    };

                    await pool.query(`
 INSERT INTO parking_spots (
          global_id, spot_type, location,
          address_desc, status,
          permit_zone, price_zone, html_zone_rate,
          block_side, enforceable_time,
          zone_cap, zone_length, seg_cap, seg_length,
          max_time, zone_type,
          parking_restrict_type, parking_restrict_time,
          lot_name, parking_type, lot_num, home_page,
          description, parking_zone, ctp_class, dot,
          parking_restriction, time_restriction,
          no_stopping, octant,
          stall_type, camera
        ) VALUES (
          $1, $2, ST_GeomFromText($3, 4326),
          $4, $5,
          $6, $7, $8,
          $9, $10,
          $11, $12, $13, $14,
          $15, $16,
          $17, $18,
          $19, $20, $21, $22,
          $23, $24, $25, $26,
          $27, $28,
          $29, $30,
          $31, $32
        )
        ON CONFLICT (global_id) DO UPDATE SET
          address_desc = EXCLUDED.address_desc,
          status = EXCLUDED.status,
          permit_zone = EXCLUDED.permit_zone,
          price_zone = EXCLUDED.price_zone,
          html_zone_rate = EXCLUDED.html_zone_rate,
          block_side = EXCLUDED.block_side,
          enforceable_time = EXCLUDED.enforceable_time,
          zone_cap = EXCLUDED.zone_cap,
          zone_length = EXCLUDED.zone_length,
          seg_cap = EXCLUDED.seg_cap,
          seg_length = EXCLUDED.seg_length,
          max_time = EXCLUDED.max_time,
          zone_type = EXCLUDED.zone_type,
          parking_restrict_type = EXCLUDED.parking_restrict_type,
          parking_restrict_time = EXCLUDED.parking_restrict_time,
          lot_name = EXCLUDED.lot_name,
          parking_type = EXCLUDED.parking_type,
          lot_num = EXCLUDED.lot_num,
          home_page = EXCLUDED.home_page,
          description = EXCLUDED.description,
          parking_zone = EXCLUDED.parking_zone,
          ctp_class = EXCLUDED.ctp_class,
          dot = EXCLUDED.dot,
          parking_restriction = EXCLUDED.parking_restriction,
          time_restriction = EXCLUDED.time_restriction,
          no_stopping = EXCLUDED.no_stopping,
          octant = EXCLUDED.octant,
          stall_type = EXCLUDED.stall_type,
          camera = EXCLUDED.camera,
          last_updated = NOW()
          `, [
                        record.globalid_guid || record.globalid,
                        dataset.type.replace('_parking', ''),
                        record.address_desc || 'No address',
                        lng,
                        lat,
                        priceMap[record.price_zone] || null,
                        parseInt(record.zone_cap) || parseInt(record.seg_cap) || 1,
                        JSON.stringify({
                            zone_type: record.zone_type || record.parking_type,
                            permit_zone: record.permit_zone,
                            enforceable_time: record.enforceable_time
                        }),
                        JSON.stringify({
                            max_time: record.max_time,
                            stall_type: record.stall_type,
                            lot_name: record.lot_name
                        })
                    ]);

                    loaded++;
                } catch (err) {
                    // Skip individual errors
                }
            }

            console.log(`✓ Loaded ${loaded} ${dataset.type} spots`);
            totalLoaded += loaded;

        } catch (error) {
            console.error(`✗ Failed to load ${dataset.type}: ${error.message}`);
        }
    }

    // Verify total
    const result = await pool.query('SELECT COUNT(*) as count FROM parking_spots');
    console.log(`\n✅ Total spots in database: ${result.rows[0].count}`);

    // Show sample
    const sample = await pool.query(`
    SELECT spot_type, COUNT(*) as count 
    FROM parking_spots 
    GROUP BY spot_type
  `);

    console.log('\nBreakdown by type:');
    sample.rows.forEach(row => {
        console.log(`  ${row.spot_type}: ${row.count} spots`);
    });

    await pool.end();
}

loadParkingData();