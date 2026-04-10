const express = require('express');
const router = express.Router();
const { pool } = require('../config/env');
const { jlog } = require('../utils/logger');

router.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    jlog('health_check_ok');
    res.json({ status: 'healthy', message: 'Database connected' });
  } catch (error) {
    jlog('health_check_failed', { error: error.message }, 'error');
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

router.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM parking_spots');
    const count = Number(result.rows[0].count);

    jlog('database_test', { totalSpots: count });

    res.json({
      success: true,
      totalSpots: count,
      message: `Database has ${count} parking spots`,
    });
  } catch (error) {
    jlog('database_test_error', { error: error.message }, 'error');
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
