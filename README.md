# ParkPal - Smart Parking Finder for Downtown Calgary

A full-stack mobile application that helps users find and manage parking spots in downtown Calgary, featuring parking availability, interactive maps, and session management.

## Project Overview

ParkPal addresses the urban challenge of finding parking in downtown Calgary by providing:
-**Real-time parking spot discovery** with distance-based search
-**Interactive map interface** with custom markers and filtering
-**Smart session management** for tracking parking duration and costs
-**Location-based search** with pin-drop functionality for custom areas

This project showcases proficiency in mobile development, backend API design, database management, and third-party service integration.

## Tech Stack

### Frontend (Mobile)

-**React Native** with Expo SDK 54
-**React Navigation** - Tab and stack navigation
-**React Native Maps** - Google Maps integration
-**Expo Location** - GPS and geolocation services
-**AsyncStorage** - Local data persistence
-**Custom animations** with React Native Animated API

### Backend

-**Node.js** with Express.js framework
-**PostgreSQL** - Primary database via Supabase
-**Redis** - Optional caching layer
-**RESTful API** architecture
-**CORS-enabled** for cross-origin requests

### Services & APIs

-**Supabase** - Database hosting and real-time features
-**Google Maps API** - Map rendering and geocoding
-**Google Places API** - Location search and autocomplete
-**PostGIS** - Spatial queries for location-based searches

## Features

### Core Functionality

#### **Smart Location Search**

-Current location detection with GPS
-Pin-drop functionality for custom search areas
-Radius-based search (150m - 1000m)
-Google Places autocomplete integration

#### **Interactive Map View**

-Real-time parking spot markers
-Custom clustering for dense areas
-Flippable cards with detailed spot information
-Dynamic map padding for UI elements

#### **Home Screen Dashboard**

-List view of nearby parking spots
-Quick filtering by type (street/lot/free)
-Pull-to-refresh functionality
-Distance and walking time calculations

#### **Session Management**

-Start/end parking sessions
-Time tracking with countdown timer
-Cost calculation based on zone rates
-Session history (planned feature)

### Technical Highlights

- **Optimized Performance**: Debounced search, lazy loading, and efficient re-renders
- **Error Handling**: Comprehensive error boundaries, fallback UI and thorough logs
- **Responsive Design**: Adaptive layouts for various screen sizes
- **State Management**: Custom hooks for business logic separation
- **Code Organization**: Modular component architecture with clear separation of concerns

## Project Structure

PARKPAL/
├── mobile/                    # React Native app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── screens/         # Main app screens
│   │   │   ├── HomeScreen/  # Parking list view
│   │   │   ├── MapScreen/   # Interactive map
│   │   │   └── SessionScreen/ # Parking session management
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API integration
│   │   ├── constants/       # App configuration
│   │   └── utils/           # Helper functions
│   ├── App.js               # App entry point
│   └── package.json         # Dependencies
│
├── backend/                 # Node.js server
│   ├── config/              # Database & app config
│   ├── services/            # Business logic
│   ├── lib/                 # Utilities
│   ├── scripts/             # Setup & migration scripts
│   ├── server.js            # Express server
│   └── package.json         # Dependencies
│
└── README.md

## Installation & Setup

### Prerequisites

-Node.js 18+ and npm/yarn
-Expo CLI (`npm install -g expo-cli`)
-PostgreSQL database (or Supabase account)
-Google Maps API key
-iOS Simulator (Mac) or Android Emulator

### Backend Setup

1.**Clone and navigate to backend:**

```bash
> cd backend
> npm install
  or
> node server.js
```

2.**Configure environment variables:**

```bash
cp .env.example .env
# Edit .env with credentials:
# - DATABASE_URL
# - SUPABASE_URL & SUPABASE_SERVICE_KEY
# - GOOGLE_MAPS_API_KEY
```

3.**Initialize database:**

```bash
npm run setup  # Creates tables and seeds data
```

4.**Start server:**

```bash
npm run dev  # Development with nodemon
# or
npm start    # Production
```

### Mobile App Setup

1.**Navigate to mobile directory:**

```bash
> cd mobile
> npm install
or
> npx expo start -c

```

2.**Configure environment:**
Create `.env` file:

```
API_URL=http://localhost:3000
GOOGLE_MAPS_API_KEY=api_key_here
```

3.**Start Expo:**

```bash
npm start
# Then press 'i' for iOS or 'a' for Android
```

## API Endpoints

### Parking Spots

-`GET /api/parking/nearby` - Find spots within radius
  -Query params: `lat`, `lng`, `radius`, `type`, `free`
-`GET /api/parking/spot/:id` - Get spot details

### Places Integration

-`GET /api/places/autocomplete` - Search suggestions
-`GET /api/places/details` - Place information

### Session Management

-`POST /api/parking/checkin` - Start parking session
-`POST /api/parking/checkout` - End session

### Health & Testing

-`GET /health` - Server health check
-`GET /api/test-db` - Database connection test

## Design Decisions

### Architecture Choices

**Modular Component Structure**: Each screen has its own directory with co-located styles, components, and logic for better maintainability.

**Custom Hooks Pattern**: Business logic is extracted into reusable hooks (`useLocationManager`, `useParkingSpots`, `useSessionManager`) for separation of concerns.

**Optimistic UI Updates**: The app updates the UI immediately while API calls happen in the background, providing a snappy user experience.

**Progressive Enhancement**: Core features work offline with cached data, with real-time updates when connected.

### Performance Optimizations

- **Spatial Indexing**: PostgreSQL with PostGIS for efficient location queries
- **Request Debouncing**: Prevents excessive API calls during user interaction
- **Lazy Loading**: Components and data load on-demand
- **Memoization**: Heavy computations cached with `useMemo`

## Contributing

This is a portfolio project, but feedback and suggestions are welcome! Feel free to open an issue or submit a pull request.

## Project Attribution

This project was developed as a Capstone Project for SAIT  in collaboration with five team members.

## My Contributions

- **UI/UX Redesign:** Completely revamped the user interface with modern design patterns
- **Map Screen Architecture:** Redesigned and implemented the interactive map functionality with flippable cards and dynamic clustering
- **Custom Hooks Development:** Created reusable hooks for location management, parking spots, and session handling
- **Performance Optimization:** Implemented debouncing, memoization, and lazy loading strategies
- **Component Refactoring:** Restructured the component architecture for better maintainability
- **API Integration:** Enhanced backend endpoints for efficient spatial queries
- **Database:** Used a different database development platform (supabase)

## Original Team

- Initial project structure and concept developed with my Capstone Project Team.
- Base functionality created collaboratively during Year 2 Semester 2 of my program.

## Author

**[Ehrl Balquin]**

**LinkedIn:** [https://www.linkedin.com/in/ehrlbalquin/]
**GitHub:** [https://github.com/ginesbal]

---

*This project showcases proficiency in mobile development, API design, database management, and modern JavaScript ecosystems.*
