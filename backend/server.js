// backend/server.js

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const { appendFile, mkdir } = require('fs/promises');

const app = express();
app.use(cors());
app.use(express.json());

// ---- logging (pretty, multi-line; writes to backend/utils/loggers/server-activity.log) ----
const LOG_DIR = process.env.LOG_DIR || path.resolve(__dirname, '../mobile/src/utils/loggers');
const LOG_FILE = process.env.LOG_FILE || path.join(LOG_DIR, 'server-activity.log');
const WRAP_COL = 120;
const PRETTY = process.env.LOG_PRETTY !== 'false'; // set to "false" for single-line json

let logDirReady = false;
async function ensureLogDir() {
  if (!logDirReady) {
    await mkdir(LOG_DIR, { recursive: true });
    logDirReady = true;
  }
}

function wrapString(s, width = WRAP_COL) {
  if (typeof s !== 'string' || s.length <= width) return s;
  const out = [];
  for (let i = 0; i < s.length; i += width) out.push(s.slice(i, i + width));
  return out.join('\n');
}

function normalize(val, seen = new WeakSet()) {
  if (val == null) return val;
  if (typeof val === 'string') return wrapString(val);
  if (typeof val === 'number' || typeof val === 'boolean') return val;
  if (val instanceof Error) return `${val.name}: ${val.message}`;
  if (typeof val === 'function') return '[Function]';

  if (Array.isArray(val)) {
    if (val.length > 50) {
      return {
        _type: 'Array',
        _length: val.length,
        _preview: val.slice(0, 50).map((x) => normalize(x, seen)),
        _note: 'truncated to 50 items',
      };
    }
    return val.map((x) => normalize(x, seen));
  }

  if (typeof val === 'object') {
    if (seen.has(val)) return '[Circular]';
    seen.add(val);
    const out = {};
    for (const k of Object.keys(val)) out[k] = normalize(val[k], seen);
    return out;
  }

  try { return String(val); } catch { return '[Unserializable]'; }
}

async function jlog(event, data = {}, level = 'info') {
  try {
    const payload = {
      t: new Date().toISOString(),
      level,
      event,
      data: normalize(data),
    };
    const body = PRETTY
      ? [
          '=== log entry =============================================================',
          JSON.stringify(payload, null, 2),
          '',
        ].join('\n')
      : JSON.stringify(payload) + '\n';

    await ensureLogDir();
    await appendFile(LOG_FILE, body);
  } catch {
    // ignore logging errors
  }
}

// ---- request id + timing ----
app.use((req, res, next) => {
  req.reqId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const start = Date.now();

  jlog('http_request', {
    id: req.reqId,
    method: req.method,
    path: req.path,
    query: Object.keys(req.query).length ? req.query : undefined,
  });

  res.on('finish', () => {
    jlog('http_response', {
      id: req.reqId,
      status: res.statusCode,
      durationMs: Date.now() - start,
      contentLength: res.getHeader('content-length') || null,
    });
  });

  next();
});

// ---- db ----
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ---- supabase (placeholder) ----
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ---- health ----
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    jlog('health_ok', { id: req.reqId });
    res.json({ status: 'healthy', message: 'Database connected' });
  } catch (error) {
    jlog('health_fail', { id: req.reqId, error: error.message }, 'error');
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// ---- nearby search ----
app.get('/api/parking/nearby', async (req, res) => {
  const started = Date.now();
  try {
    const { lat, lng, radius = 500, type, free } = req.query;

    if (!lat || !lng) {
      jlog('nearby_missing_coords', { id: req.reqId });
      return res.status(400).json({ error: 'lat and lng required' });
    }

    const where = [];
    const params = [];
    let p = 1;

    // st_dwithin(location, makepoint(lng,lat), radius)
    where.push(`ST_DWithin(location, ST_MakePoint($${p + 1}, $${p})::geography, $${p + 2})`);
    params.push(lat, lng, radius);
    p += 3;

    if (type && type !== 'all') {
      where.push(`spot_type = $${p}`);
      params.push(type);
      p += 1;
    }

    if (free === 'true') {
      where.push(`(price_zone IS NULL OR price_zone = '0' OR price_zone = '')`);
    }

    const sql = `
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
      WHERE ${where.join(' AND ')}
      ORDER BY distance
      LIMIT 100
    `;

    const result = await pool.query(sql, params);
    const ms = Date.now() - started;

    jlog('nearby_query_done', {
      id: req.reqId,
      lat: Number(lat),
      lng: Number(lng),
      radius: Number(radius),
      type: type || 'all',
      free: free === 'true',
      count: result.rows.length,
      ms,
    });

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows.map((spot) => ({
        id: spot.id,
        spot_type: spot.spot_type,
        address: spot.address_desc || 'Unknown Address',
        coordinates: spot.coordinates,
        distance: Math.round(spot.distance),
        walkingTime: Math.ceil(spot.distance / 80),

        capacity: spot.zone_cap || spot.seg_cap || 0,
        available: spot.zone_cap || spot.seg_cap || 0,

        zone_info: {
          permit_zone: spot.permit_zone,
          price_zone: spot.price_zone,
          html_zone_rate: spot.html_zone_rate,
          zone_type: spot.zone_type,
          parking_zone: spot.parking_zone,
          enforceable_time: spot.enforceable_time,
        },

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
          octant: spot.octant,
        },

        price_per_hour: spot.price_zone
          ? {
              '1': 1.0,
              '2': 2.0,
              '3': 3.0,
              '4': 4.0,
              '5': 5.0,
              '6': 6.0,
            }[spot.price_zone] || 0
          : 0,

        max_duration_minutes: spot.max_time ? parseFloat(spot.max_time) : null,
      })),
    });
  } catch (error) {
    jlog('nearby_query_error', { id: req.reqId, error: error.message }, 'error');
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.detail || 'Unknown error',
    });
  }
});

// ---- spot details ----
app.get('/api/parking/spot/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *, ST_AsGeoJSON(location)::json as coordinates
      FROM parking_spots
      WHERE id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      jlog('spot_not_found', { id: req.reqId, spotId: id });
      return res.status(404).json({ error: 'Spot not found' });
    }

    jlog('spot_found', { id: req.reqId, spotId: id });
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    jlog('spot_details_error', { id: req.reqId, error: error.message }, 'error');
    res.status(500).json({ error: error.message });
  }
});

// ---- db count ----
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM parking_spots');
    jlog('db_count', { id: req.reqId, count: Number(result.rows[0].count) });
    res.json({
      success: true,
      totalSpots: result.rows[0].count,
      message: `Database has ${result.rows[0].count} parking spots`,
    });
  } catch (error) {
    jlog('db_count_error', { id: req.reqId, error: error.message }, 'error');
    res.status(500).json({ error: error.message });
  }
});

// ---- placeholders ----
app.post('/api/parking/checkin', async (req, res) => {
  jlog('checkin_placeholder', { id: req.reqId });
  res.json({
    success: false,
    message: 'Check-in feature coming soon',
    placeholder: true,
  });
});

app.post('/api/parking/checkout', async (req, res) => {
  jlog('checkout_placeholder', { id: req.reqId });
  res.json({
    success: false,
    message: 'Checkout feature coming soon',
    placeholder: true,
  });
});

// ---- places autocomplete ----
app.get('/api/places/autocomplete', async (req, res) => {
  try {
    const { input, components, sessiontoken } = req.query;

    if (!input) {
      jlog('places_autocomplete_missing_input', { id: req.reqId });
      return res.status(400).json({ error: 'Input parameter required' });
    }

    const params = {
      input,
      key: process.env.GOOGLE_PLACES_API_KEY, // not logged
      components: components || 'country:ca',
      sessiontoken: sessiontoken || '',
    };

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      { params }
    );

    jlog('places_autocomplete', {
      id: req.reqId,
      status: response.data?.status,
      predictions: Array.isArray(response.data?.predictions)
        ? response.data.predictions.length
        : 0,
    });

    res.json(response.data);
  } catch (error) {
    jlog('places_autocomplete_error', { id: req.reqId, error: error.message }, 'error');
    res.status(500).json({ error: error.message });
  }
});

// ---- places details ----
app.get('/api/places/details', async (req, res) => {
  try {
    const { place_id, sessiontoken, fields } = req.query;

    if (!place_id) {
      jlog('places_details_missing_id', { id: req.reqId });
      return res.status(400).json({ error: 'place_id required' });
    }

    const params = {
      place_id,
      key: process.env.GOOGLE_PLACES_API_KEY, // not logged
      fields: fields || 'geometry,formatted_address,name,place_id,types',
      sessiontoken: sessiontoken || '',
    };

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      { params }
    );

    jlog('places_details', {
      id: req.reqId,
      status: response.data?.status,
      hasResult: !!response.data?.result,
    });

    res.json(response.data);
  } catch (error) {
    jlog('places_details_error', { id: req.reqId, error: error.message }, 'error');
    res.status(500).json({ error: error.message });
  }
});

// ---- process-level errors ----
process.on('unhandledRejection', (err) => {
  jlog('unhandled_rejection', { error: err?.message || String(err) }, 'error');
});
process.on('uncaughtException', (err) => {
  jlog('uncaught_exception', { error: err?.message || String(err) }, 'error');
});

// ---- final error handler ----
app.use((err, req, res, _next) => {
  jlog('unhandled_error', { id: req.reqId, error: err?.message }, 'error');
  res.status(500).json({ error: 'internal error' });
});

// ---- start ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  jlog('server_start', {
    port: PORT,
    health: '/health',
    testDb: '/api/test-db',
    nearbyExample: '/api/parking/nearby?lat=51.0447&lng=-114.0719&radius=1000',
    logFile: LOG_FILE,
  });
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Test DB: http://localhost:${PORT}/api/test-db`);
  console.log(
    `Test nearby: http://localhost:${PORT}/api/parking/nearby?lat=51.0447&lng=-114.0719&radius=1000`
  );
});
