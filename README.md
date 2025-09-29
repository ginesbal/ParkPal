# ParkPal — Smart Parking Finder for Calgary

A focused React Native + Supabase app that helps drivers find on‑street and lot parking in downtown Calgary. It combines live data with lightweight predictions and clear walking‑time estimates.

> Replace `docs/screenshot.png` with your own.

![ParkPal Demo](docs/screenshot.png)

---

## Table of Contents

- [Quick Start](#quick-start)
- [Requirements](#requirements)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Mobile App Setup](#mobile-app-setup)
- [Configuration](#configuration)
- [API](#api)
- [Database](#database)
- [Data Sources](#data-sources)
- [Scripts](#scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# 1) Clone
git clone https://github.com/yourusername/parkpal.git
cd parkpal

# 2) Backend
  cd backend
  node server.js

cd backend
npm install
cp .env.example .env
# Fill in .env (see Configuration below)
npm run setup:db      # creates tables / types
npm run load:data     # (optional) seed initial parking data
npm start             # http://localhost:3000

# 3) Mobile (new terminal)
cd ../mobile
npm install
# Edit src/constants/config.js with your API_URL
npx expo start --clear      # press i (iOS) or a (Android)
```

## Requirements

- Node.js ≥ 20
- npm or yarn
- Expo CLI (`npx expo` works, global install optional)
- Supabase project (free tier is fine)
- iOS Simulator (macOS) or Android Studio / physical device with Expo Go

## Project Structure

# Database / Supabase

SUPABASE_URL=your-project-url
SUPABASE_SERVICE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@host:5432/postgres

# External APIs (optional)

CALGARY_API_TOKEN=
GOOGLE_MAPS_API_KEY=

# Server

PORT=3000
NODE_ENV=development

```
parkpal/
├─ backend/                # Express (or Fastify) + Supabase client
│  ├─ src/
│  │  ├─ index.js
│  │  ├─ routes/
│  │  │  └─ parking.js
│  │  └─ db/
│  │     ├─ migrations/
│  │     │  └─ 001_init.sql
│  │     └─ seeds/
│  │        └─ parking_seed.sql
│  ├─ package.json
│  └─ .env.example
├─ mobile/                 # React Native (Expo)
│  ├─ src/
│  │  ├─ screens/
│  │  ├─ components/
│  │  └─ constants/config.js
│  ├─ app.json
│  └─ package.json
└─ docs/
   └─ screenshot.png
```

## Backend Setup

1) **Create a Supabase project** → copy the URL and service key.
2) **Configure `.env`** in `backend/`:

```env
# Database / Supabase
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@host:5432/postgres

# External APIs (optional)
CALGARY_API_TOKEN=
GOOGLE_MAPS_API_KEY=

# Server
PORT=3000
NODE_ENV=development
```

3) **Initialize DB**

```bash
npm run setup:db   # runs SQL in src/db/migrations
npm run load:data  # optional seed
```

4) **Run**

```bash
npm start          # http://localhost:3000
```

## Mobile App Setup

1) Install deps and configure:

```bash
cd mobile
npm install
```

2) `src/constants/config.js`:

```javascript
export const API_URL = "http://localhost:3000"; // or your deployed backend
export const MAP_API_KEY = "your-google-maps-key";
```

3) Start Expo:

```bash
npx expo start
# i → iOS simulator, a → Android emulator, or scan QR with Expo Go
```

## Configuration

- **Local dev**: keep `API_URL` pointing to `http://localhost:3000`.
- **Device testing on the same network**: use your computer’s LAN IP, e.g. `http://192.168.0.10:3000`.
- **Production**: set a hosted URL and disable dev toggles.

---

## API

**Base URL:** `http://localhost:3000/api`

### Find Nearby Parking

**Request**

```http
GET /api/parking/nearby?lat=51.0447&lng=-114.0719&radius=500
```

**Response**

```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": "uuid",
      "address": "123 Centre St",
      "distance": 120,           // meters
      "walkingTime": 2,          // minutes
      "available": 3,
      "capacity": 5,
      "pricePerHour": 2.0
    }
  ]
}
```

### Check In

```http
POST /api/parking/checkin
Content-Type: application/json

{
  "deviceId": "device-uuid",
  "spotId": "spot-uuid",
  "duration": 120
}
```

### Check Out

```http
POST /api/parking/checkout
Content-Type: application/json

{
  "deviceId": "device-uuid",
  "checkInId": "checkin-uuid"
}
```

> Tip: add an `Authorization` header if you later secure endpoints.

---

## Database

Minimal schema in Postgres (Supabase):

```sql
-- parking_spots
create table if not exists parking_spots (
  id uuid primary key default gen_random_uuid(),
  global_id text,
  spot_type text check (spot_type in ('on_street','lot','residential')),
  address text,
  location geography(point, 4326),
  price_per_hour numeric,
  capacity int,
  metadata jsonb default '{}'
);

-- check_ins
create table if not exists check_ins (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid references parking_spots(id) on delete cascade,
  device_id text not null,
  checked_in_at timestamptz default now(),
  checked_out_at timestamptz,
  status text check (status in ('active','completed','cancelled')) default 'active'
);

create index if not exists idx_parking_spots_location on parking_spots using gist (location);
```

---

## Data Sources

- **Calgary Open Data Portal** — on/off‑street zones, restrictions, rates.
- (Optional) **Google Maps** — reverse‑geocoding and walking time fallbacks when city data is missing.

> Keep a small caching layer; city APIs can rate‑limit.

---

## Scripts

From `backend/`:

```bash
npm run setup:db   # apply migrations
npm run load:data  # seed initial data
npm start          # start API
npm test           # backend tests (if configured)
```

From `mobile/`:

```bash
npx expo start     # dev server
npm test           # mobile tests (if configured)
```

---

## Testing

```bash
# Backend
cd backend
npm test

# Mobile
cd ../mobile
npm test
```

---

## Deployment

### Backend (Railway/Render/etc.)

```bash
# Railway example
npm i -g @railway/cli
railway login
railway init
railway up
```

Set env vars in your host dashboard. Expose `PORT`.

### Mobile (Expo EAS)

```bash
# build
npx expo install eas-cli
npx eas build --platform ios
npx eas build --platform android

# submit
npx eas submit --platform ios
npx eas submit --platform android
```

---

## Troubleshooting

- **Expo app can’t reach backend**: use your machine’s LAN IP instead of `localhost`.
- **Hydration/Metro cache issues**: stop dev servers, clear caches (`expo start -c`), reinstall deps.
- **Supabase auth/permissions**: ensure policies allow your reads/writes or use RLS with service key server‑side only.

---

## License

MIT (or your choice).
