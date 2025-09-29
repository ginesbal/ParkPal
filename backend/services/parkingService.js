const db = require('../config/database');
const cache = require('../lib/cache');
const { AppError } = require('../lib/errors');
const { MAX_SEARCH_RADIUS } = require('../config/constants');

class ParkingService {
  async findNearbySpots(lat, lng, radius = 500, filters = {}) {
    // Validate inputs
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new AppError('Invalid coordinates', 400);
    }

    radius = Math.min(radius, MAX_SEARCH_RADIUS);

    // Check cache
    const cacheKey = `spots:${lat.toFixed(3)}:${lng.toFixed(3)}:${radius}:${JSON.stringify(filters)}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const query = `
    WITH nearby AS (
      SELECT 
        *,
        ST_Distance(location, ST_MakePoint($2, $1)::geography) as distance,
        ST_AsGeoJSON(location)::json as location_json
      FROM parking_spots
      WHERE 
        status = 'Active'
        AND ST_DWithin(location, ST_MakePoint($2, $1)::geography, $3)
        ${filters.type ? `AND spot_type = '${filters.type}'` : ''}
        ${filters.free ? `AND (price_zone IS NULL OR price_zone = '0')` : ''}
    )
    SELECT 
      id,
      global_id,
      spot_type,
      address_desc,
      permit_zone,
      price_zone,
      html_zone_rate,
      enforceable_time,
      zone_cap as capacity,
      max_time as max_duration_minutes,
      stall_type,
      camera,
      block_side,
      zone_type,
      parking_restrict_type,
      parking_restrict_time,
      lot_name,
      parking_type,
      lot_num,
      home_page,
      description,
      parking_zone,
      parking_restriction,
      time_restriction,
      no_stopping,
      distance,
      location_json,
      CEIL(distance / 80.0) as walking_time
    FROM nearby
    ORDER BY distance
    LIMIT 100
  `;

    const result = await db.query(query, [lat, lng, radius]);

    return result.rows.map(spot => ({
      id: spot.id,
      global_id: spot.global_id,
      spot_type: spot.spot_type,
      address: spot.address_desc,
      coordinates: spot.location_json,
      distance: Math.round(spot.distance),
      walkingTime: spot.walking_time,

      // Include all actual fields
      permit_zone: spot.permit_zone,
      price_zone: spot.price_zone,
      html_zone_rate: spot.html_zone_rate,
      enforceable_time: spot.enforceable_time,
      capacity: spot.capacity,
      max_duration_minutes: spot.max_duration_minutes,
      stall_type: spot.stall_type,
      camera: spot.camera,
      block_side: spot.block_side,
      zone_type: spot.zone_type,
      parking_restrict_type: spot.parking_restrict_type,
      parking_restrict_time: spot.parking_restrict_time,

      // Off-street
      lot_name: spot.lot_name,
      parking_type: spot.parking_type,
      lot_num: spot.lot_num,
      home_page: spot.home_page,

      // Residential/School
      description: spot.description,
      parking_zone: spot.parking_zone,
      parking_restriction: spot.parking_restriction,
      time_restriction: spot.time_restriction,
      no_stopping: spot.no_stopping
    }));
  }
  async checkIn(deviceId, spotId, duration = 120) {
    // Check if device already has active session
    const existingSession = await db.query(
      'SELECT id FROM check_ins WHERE device_id = $1 AND status = $2',
      [deviceId, 'active']
    );

    if (existingSession.rows.length > 0) {
      throw new AppError('Device already has an active parking session', 409);
    }

    // Check spot availability
    const spotCheck = await db.query(`
      SELECT 
        s.*, 
        COUNT(c.id) as occupied
      FROM parking_spots s
      LEFT JOIN check_ins c ON c.spot_id = s.id AND c.status = 'active'
      WHERE s.id = $1
      GROUP BY s.id
    `, [spotId]);

    if (spotCheck.rows.length === 0) {
      throw new AppError('Parking spot not found', 404);
    }

    const spot = spotCheck.rows[0];
    if (spot.occupied >= spot.capacity) {
      throw new AppError('Parking spot is full', 409);
    }

    // Create check-in
    const scheduledEnd = new Date(Date.now() + duration * 60000);
    const result = await db.query(`
      INSERT INTO check_ins (spot_id, device_id, scheduled_end)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [spotId, deviceId, scheduledEnd]);

    // Update occupancy pattern
    this._updateOccupancy(spotId, 1);

    // Invalidate cache
    await cache.invalidate('spots:*');

    // Broadcast update if using Supabase realtime
    if (db.supabase) {
      db.supabase.channel('parking').send({
        type: 'broadcast',
        event: 'spot-update',
        payload: { spotId, available: spot.capacity - spot.occupied - 1 }
      });
    }

    return {
      checkInId: result.rows[0].id,
      spotId,
      scheduledEnd,
      spotDetails: {
        address: spot.address,
        pricePerHour: spot.price_per_hour
      }
    };
  }

  async checkOut(deviceId, checkInId) {
    const result = await db.query(`
      UPDATE check_ins 
      SET status = 'completed', checked_out_at = NOW()
      WHERE id = $1 AND device_id = $2 AND status = 'active'
      RETURNING *, EXTRACT(EPOCH FROM (checked_out_at - checked_in_at))/60 as duration_minutes
    `, [checkInId, deviceId]);

    if (result.rows.length === 0) {
      throw new AppError('Active check-in not found', 404);
    }

    const checkIn = result.rows[0];

    // Update occupancy
    this._updateOccupancy(checkIn.spot_id, -1);

    // Invalidate cache
    await cache.invalidate('spots:*');

    // Broadcast update
    if (db.supabase) {
      db.supabase.channel('parking').send({
        type: 'broadcast',
        event: 'spot-update',
        payload: { spotId: checkIn.spot_id, action: 'checkout' }
      });
    }

    return {
      duration: Math.round(checkIn.duration_minutes),
      spotId: checkIn.spot_id
    };
  }

  async getActiveSession(deviceId) {
    const result = await db.query(`
      SELECT 
        c.*,
        s.address,
        s.price_per_hour,
        ST_AsGeoJSON(s.location)::json as location
      FROM check_ins c
      JOIN parking_spots s ON c.spot_id = s.id
      WHERE c.device_id = $1 AND c.status = 'active'
    `, [deviceId]);

    return result.rows[0] || null;
  }

  async _updateOccupancy(spotId, delta) {
    const now = new Date();
    await db.query(`
      INSERT INTO occupancy_patterns (spot_id, day_of_week, hour_of_day, avg_occupancy_rate, sample_count)
      VALUES ($1, $2, $3, $4, 1)
      ON CONFLICT (spot_id, day_of_week, hour_of_day)
      DO UPDATE SET
        avg_occupancy_rate = LEAST(1.0, GREATEST(0, occupancy_patterns.avg_occupancy_rate + $4)),
        sample_count = occupancy_patterns.sample_count + 1,
        last_updated = NOW()
    `, [spotId, now.getDay(), now.getHours(), delta * 0.1]);
  }
}

module.exports = new ParkingService();