const db = require('../config/database');
const cache = require('../lib/cache');

class PredictionService {
    async getPrediction(spotId, targetTime = new Date()) {
        const cacheKey = `prediction:${spotId}:${targetTime.getHours()}`;
        const cached = await cache.get(cacheKey);
        if (cached) return cached;

        const day = targetTime.getDay();
        const hour = targetTime.getHours();

        // Get historical pattern
        const patternResult = await db.query(`
      SELECT avg_occupancy_rate, sample_count
      FROM occupancy_patterns
      WHERE spot_id = $1 AND day_of_week = $2 AND hour_of_day = $3
    `, [spotId, day, hour]);

        // Get current status
        const currentResult = await db.query(`
      SELECT COUNT(*) as occupied, s.capacity
      FROM parking_spots s
      LEFT JOIN check_ins c ON c.spot_id = s.id AND c.status = 'active'
      WHERE s.id = $1
      GROUP BY s.id
    `, [spotId]);

        const pattern = patternResult.rows[0] || { avg_occupancy_rate: 0.5, sample_count: 0 };
        const current = currentResult.rows[0] || { occupied: 0, capacity: 1 };

        const prediction = {
            currentOccupancy: (current.occupied / current.capacity) * 100,
            predictedOccupancy: pattern.avg_occupancy_rate * 100,
            confidence: Math.min(pattern.sample_count / 10, 1) * 100,
            busyLevel: this._getBusyLevel(pattern.avg_occupancy_rate),
            recommendation: this._getRecommendation(pattern.avg_occupancy_rate, current.occupied, current.capacity)
        };

        await cache.set(cacheKey, prediction, 600); // Cache for 10 minutes
        return prediction;
    }

    async getBestTimes(spotId) {
        const result = await db.query(`
      SELECT hour_of_day, AVG(avg_occupancy_rate) as avg_rate
      FROM occupancy_patterns
      WHERE spot_id = $1
      GROUP BY hour_of_day
      ORDER BY avg_rate ASC
      LIMIT 5
    `, [spotId]);

        return result.rows.map(row => ({
            hour: row.hour_of_day,
            occupancyRate: row.avg_rate * 100,
            label: this._getTimeLabel(row.hour_of_day)
        }));
    }

    _getBusyLevel(rate) {
        if (rate > 0.8) return 'very_busy';
        if (rate > 0.6) return 'busy';
        if (rate > 0.4) return 'moderate';
        return 'quiet';
    }

    _getRecommendation(predictedRate, occupied, capacity) {
        const available = capacity - occupied;
        if (available === 0) return 'Full - look for alternatives';
        if (predictedRate > 0.8) return 'Usually very busy at this time';
        if (predictedRate > 0.6) return 'Likely to find parking but may be busy';
        return 'Good chance of finding parking';
    }

    _getTimeLabel(hour) {
        if (hour === 0) return '12 AM';
        if (hour < 12) return `${hour} AM`;
        if (hour === 12) return '12 PM';
        return `${hour - 12} PM`;
    }
}

module.exports = new PredictionService();