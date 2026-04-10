# CurbFlow Backend

Node.js API for parking spot search in downtown Calgary using PostGIS spatial queries.

## Quick Start

```bash
cd backend
npm install
npm start
```

## API Endpoints

- `GET /api/parking/nearby?lat=51.0447&lng=-114.0719&radius=1000`
- `GET /health`

Live API: <https://curbflow-production.up.railway.app>

---

## Troubleshooting

### Database Errors (`ECONNREFUSED`, `timeout`)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. If project is paused → Click **Restore**
3. Check `.env` has correct `DATABASE_URL`

### Railway Errors (`404`, `Application not found`)

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Check if project exists and is running
3. If stopped → Click **Deploy** to restart

### Mobile App Shows Mock Data

Backend is unreachable. Start it locally with `npm start` or check Railway deployment.

