const axios = require('axios');
const db = require('../config/database');
const logger = require('../lib/logger');
require('../config/constants');

class ETLService {
    constructor() {
        this.datasets = [
            { type: 'on_street', endpoint: '45az-7kh9.json' },
            { type: 'off_street', endpoint: 'ggxk-g2u3.json' },
            { type: 'residential', endpoint: '2rmy-g65b.json' },
            { type: 'school', endpoint: '9hbw-zj92.json' }
        ];
    }

    async syncAllDatasets() {
        const results = [];

        for (const dataset of this.datasets) {
            try {
                logger.info(`Syncing ${dataset.type} data...`);
                const count = await this.syncDataset(dataset);
                results.push({ type: dataset.type, success: true, count });
                logger.info(`Successfully synced ${count} ${dataset.type} records`);
            } catch (error) {
                results.push({ type: dataset.type, success: false, error: error.message });
                logger.error(`Failed to sync ${dataset.type}:`, error);
            }
        }

        return results;
    }

    async syncDataset(dataset) {
        const url = `https://data.calgary.ca/resource/${dataset.endpoint}`;

        let offset = 0;
        let totalSynced = 0;
        const limit = 1000;

        while (true) {
            try {
                const response = await axios.get(url, {
                    params: {
                        $limit: limit,
                        $offset: offset,
                        $$app_token: process.env.CALGARY_API_TOKEN
                    },
                    timeout: 30000
                });

                if (!response.data || response.data.length === 0) break;

                for (const record of response.data) {
                    await this.upsertRecord(record, dataset.type);
                    totalSynced++;
                }

                logger.info(`Processed ${totalSynced} ${dataset.type} records so far...`);

                if (response.data.length < limit) break;
                offset += limit;

            } catch (error) {
                logger.error(`Error fetching ${dataset.type} at offset ${offset}:`, error.message);
                break;
            }
        }

        return totalSynced;
    }

    extractLocation(record, type) {
        try {
            let coords = null;

            if (type === 'off_street' && record.multipolygon?.coordinates) {
                // Calculate centroid for parking lots
                const polygon = record.multipolygon.coordinates[0][0];
                const lng = polygon.reduce((sum, pt) => sum + pt[0], 0) / polygon.length;
                const lat = polygon.reduce((sum, pt) => sum + pt[1], 0) / polygon.length;
                coords = [lng, lat];
            } else if ((type === 'residential' || type === 'school') && record.line?.coordinates) {
                // Use first point of line
                coords = record.line.coordinates[0][0];
            } else if (record.the_geom?.coordinates) {
                // Use first point for on_street
                coords = record.the_geom.coordinates[0][0];
            }

            if (coords && coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                return `POINT(${coords[0]} ${coords[1]})`;
            }

            return null;
        } catch (error) {
            logger.error('Location extraction error:', error);
            return null;
        }
    }

    async upsertRecord(record, type) {
        const location = this.extractLocation(record, type);
        if (!location) {
            logger.warn(`Skipping record without valid location: ${record.globalid_guid || record.globalid}`);
            return;
        }

        try {
            const query = `
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
      `;

            await db.query(query, [
                record.globalid_guid || record.globalid || record.global_id,
                type,
                location,
                record.address_desc,
                record.status || 'Active',
                // On-street fields
                record.permit_zone,
                record.price_zone,
                record.html_zone_rate,
                record.block_side,
                record.enforceable_time,
                record.zone_cap ? parseInt(record.zone_cap) : null,
                record.zone_length ? parseFloat(record.zone_length) : null,
                record.seg_cap ? parseInt(record.seg_cap) : null,
                record.seg_length ? parseFloat(record.seg_length) : null,
                record.max_time ? parseFloat(record.max_time) : null,
                record.zone_type,
                record.parking_restrict_type,
                record.parking_restrict_time,
                // Off-street fields
                record.lot_name,
                record.parking_type,
                record.lot_num,
                record.home_page?.url || null,
                // Residential/School fields
                record.description,
                record.parking_zone,
                record.ctp_class,
                record.dot,
                record.parking_restriction,
                record.time_restriction,
                record.no_stopping,
                record.octant,
                // Common fields
                record.stall_type,
                record.camera
            ]);
        } catch (error) {
            logger.error(`Failed to upsert record ${record.globalid_guid}:`, error.message);
        }
    }
}

module.exports = new ETLService();