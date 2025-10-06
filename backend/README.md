# ParkPal Backend

Node.js API for parking spot search in downtown Calgary using PostGIS spatial queries.

## Performance

Query performance verified through automated testing:

- Average: ~120ms
- Spots retrieved: 100+
- Spatial accuracy: 100%

Run tests: `npm test`

## API Endpoints

- `GET /api/parking/nearby?lat=51.0447&lng=-114.0719&radius=1000`
- `GET /health`

Live API: <https://parkpal-production.up.railway.app>
