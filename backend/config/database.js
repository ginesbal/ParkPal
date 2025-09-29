// config/database.js
require('dotenv').config(); // <-- ensure env vars are loaded for any entrypoint

const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const Redis = require('ioredis');
const logger = require('../lib/logger');

class DatabaseService {
    constructor() {
        this.supabase = null;
        this.pgPool = null;
        this.redis = null;
    }

    async initialize() {
        // ===== Supabase (real-time, storage, RPC, etc.) =====
        const SUPABASE_URL =
            process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

        // Accept multiple keys: prefer service role on the server
        const SUPABASE_KEY =
            process.env.SUPABASE_SERVICE_ROLE_KEY ||
            process.env.SUPABASE_SERVICE_KEY ||      // <- your current var
            process.env.SUPABASE_ANON_KEY ||
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!SUPABASE_URL) {
            throw new Error(
                'Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL). Add it to .env.'
            );
        }
        if (!SUPABASE_KEY) {
            throw new Error(
                'Missing Supabase key. Provide SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_SERVICE_KEY / SUPABASE_ANON_KEY.'
            );
        }

        this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
            auth: { persistSession: false },
        });

        // ===== PostgreSQL (direct, for complex queries) =====
        // If your DATABASE_URL already has ?sslmode=require, pg will use SSL automatically.
        const poolConfig = {
            connectionString: process.env.DATABASE_URL,
            max: Number(process.env.PG_POOL_MAX || 10),
            idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT || 30_000),
            connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT || 5_000),
        };

        // Enable SSL by default for cloud DBs unless explicitly disabled
        const wantSSL = (process.env.DATABASE_SSL ?? 'true').toLowerCase() !== 'false';
        if (wantSSL) {
            // For many managed Postgres providers (incl. Supabase/Heroku), this is fine
            poolConfig.ssl = { rejectUnauthorized: false };
        }

        if (!poolConfig.connectionString) {
            throw new Error(
                'Missing DATABASE_URL in .env (e.g., postgresql://user:pass@host:5432/dbname?sslmode=require)'
            );
        }

        this.pgPool = new Pool(poolConfig);

        // Test the connection early to fail fast
        try {
            await this.pgPool.query('SELECT 1');
        } catch (e) {
            logger.error('PostgreSQL connection test failed:', e);
            throw e;
        }

        // ===== Optional Redis cache =====
        if (process.env.ENABLE_CACHE === 'true' && process.env.REDIS_URL) {
            this.redis = new Redis(process.env.REDIS_URL, {
                lazyConnect: true,
                maxRetriesPerRequest: 2,
            });
            try {
                await this.redis.connect();
            } catch (e) {
                logger.warn('Redis connection failed (continuing without cache):', e.message);
                this.redis = null;
            }
        }

        logger.info('Database connections initialized');
    }

    async query(text, params) {
        const start = Date.now();
        const result = await this.pgPool.query(text, params);
        const duration = Date.now() - start;

        if (duration > 1000) {
            logger.warn(`Slow query (${duration}ms): ${text.substring(0, 100)}`);
        }

        return result;
    }

    async healthCheck() {
        const status = { healthy: true, checks: {} };

        try {
            await this.pgPool.query('SELECT 1');
            status.checks.postgres = 'ok';
        } catch (error) {
            status.healthy = false;
            status.checks.postgres = `error: ${error.message}`;
            logger.error('Postgres health check failed:', error);
        }

        if (this.redis) {
            try {
                const pong = await this.redis.ping();
                status.checks.redis = pong === 'PONG' ? 'ok' : `unexpected: ${pong}`;
            } catch (error) {
                status.healthy = false;
                status.checks.redis = `error: ${error.message}`;
                logger.error('Redis health check failed:', error);
            }
        } else {
            status.checks.redis = 'disabled';
        }

        // Supabase client doesn’t have a cheap ping; if needed, add a lightweight RPC/table check.
        status.checks.supabase = 'configured';

        return status;
    }

    async shutdown() {
        try {
            await this.pgPool?.end();
        } catch (e) {
            logger.warn('Error while closing Postgres pool:', e.message);
        }
        try {
            await this.redis?.quit();
        } catch (e) {
            logger.warn('Error while closing Redis:', e.message);
        }
    }
}

module.exports = new DatabaseService();
