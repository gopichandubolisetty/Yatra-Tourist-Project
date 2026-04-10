# 🗺️ YATRA — Your Journey, Your Way

> A Tourist Management System built with MERN-style stack and **local JSON file storage** (no MongoDB).  
> VIT-AP University | Software Engineering Project

YATRA runs **fully offline** on your laptop: data lives in `server/data/*.json`. Maps use **Leaflet + OpenStreetMap** (no API key). Geocoding uses the free **Nominatim** service when you have internet.

## 👥 Team

| Name | Roll Number |
|------|-------------|
| S. Ganesh Sai | 24BCW7071 |
| SK. Jaheer | 24BCE8191 |
| B. Gopi Chandu | 24BCS7134 |
| K. Sarat | 24BCS7066 |

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (includes npm)

### 1. Install dependencies

From the **project root** (`yatra/`):

```bash
npm install
npm run install:all
```

This installs root tooling plus `server/` and `client/` packages.

Alternatively, install manually:

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Environment

Copy `.env.example` to `.env` in the **project root** (or use the provided `.env`). Values:

- `PORT` — API port (default `5000`)
- `JWT_SECRET` — secret for JWT signing
- `CLIENT_URL` — Vite dev URL (`http://localhost:5173`)
- `APP_NAME` — `Yatra`

### 3. Seed demo data

From project root:

```bash
npm run seed
```

Creates **demo@yatra.com** / **demo123**, sample trips, stops, and a welcome notification. Ensures `poi.json` stays seeded with 30+ Indian POIs.

### 4. Run the app

From project root:

```bash
npm run dev
```

- **Frontend (YATRA UI):** http://localhost:5173  
- **Backend API:** http://localhost:5000  
- **Health check:** http://localhost:5000/api/health  

**Demo login:** `demo@yatra.com` / `demo123`

### Scripts (reference)

| Location | Command | Purpose |
|----------|---------|---------|
| Root | `npm run dev` | API + Vite together (requires `concurrently`) |
| `server/` | `npm run dev` | API only (nodemon) |
| `server/` | `npm start` | API (node) |
| `server/` | `npm run seed` | Run seed script |
| `client/` | `npm run dev` | Vite dev server |
| `client/` | `npm run build` | Production build |

## 📁 Data Storage

All persistent data is stored as JSON arrays under **`server/data/`**:

| File | Contents |
|------|----------|
| `users.json` | Users (bcrypt password hashes) |
| `trips.json` | Trips |
| `stops.json` | Trip stops (max 5 per trip in API) |
| `bookings.json` | Ride bookings (YatraRide, SwiftCab, BharatDrive) |
| `payments.json` | Mock YatraPay payments |
| `notifications.json` | In-app notifications |
| `poi.json` | Hotels & restaurants (seeded) |
| `reviews.json` | Reviews (extensible) |

No database server, Docker, or cloud storage required.

## ✨ Features

- **YATRA branding** — Deep Saffron (#FF6B00), Dark Teal (#006B6B), Cream (#FFF8F0); Devanagari **यात्रा** + English **YATRA**
- **JWT auth** (7-day token, `localStorage`)
- **Multi-stop trip planning** (up to 5 stops, Nominatim geocoding, Leaflet map, reorder)
- **Mock ride quotes** — ₹ pricing: cab `₹50 + ₹12/km` (multipliers per provider), Auto for shorter routes
- **Mock YatraPay** — UPI / card / cash; ~95% success; assigns random Indian driver details on success
- **Explore nearby** — Haversine filtering on local `poi.json` (hotels & restaurants across major Indian cities)
- **Live tracking** — Socket.io: traveller position + simulated driver movement toward pickup
- **Notifications** — Booking and payment events; bell + full page
- **Profile & history** — Preferences and aggregated trips / bookings / payments

## 🛠️ Tech Stack

**Frontend:** React (Vite), JavaScript, React Router v6, Axios, Tailwind CSS, Socket.io-client, React Hot Toast, React Hook Form, Leaflet, React-Leaflet  

**Backend:** Node.js, Express, JSON file storage (`fs` sync + `fileStore.js`), Socket.io, JWT, bcryptjs, uuid, cors, helmet, express-rate-limit, dotenv  

**Maps / geo:** OpenStreetMap tiles, Nominatim (optional network), Haversine for POI distance  

---

**YATRA** — *Your Journey, Your Way* · © 2026
"# Yatra-Tourist-Project" 
