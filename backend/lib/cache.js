const db = require('../config/database');

class CacheService {
    async get(key) {
        if (!db.redis) return null;

        try {
            const value = await db.redis.get(key);
            return value ? JSON.parse(value) : null;
        } catch {
            return null;
        }
    }

    async set(key, value, ttl = 300) {
        if (!db.redis) return;

        try {
            await db.redis.setex(key, ttl, JSON.stringify(value));
        } catch (error) {
            // Fail silently - cache is optional
        }
    }

    async invalidate(pattern) {
        if (!db.redis) return;

        try {
            const keys = await db.redis.keys(pattern);
            if (keys.length > 0) {
                await db.redis.del(...keys);
            }
        } catch (error) {
            // Fail silently
        }
    }
}

module.exports = new CacheService();