# SolarShare — Peer-to-Peer Solar Energy Trading Platform

MERN stack app for the SolarShare final-year project.

```
SolarShare/
├── backend/     # Express + MongoDB (Atlas) + Socket.io
├── frontend/    # React (Vite) + Tailwind
└── package.json # run both apps from the root
```

## Getting started

### 1. Install dependencies
```bash
npm run install:all
# or: cd backend && npm install && cd ../frontend && npm install
```

### 2. Configure backend env
```bash
cp backend/.env.example backend/.env
```
Set `MONGO_URI` to your MongoDB Atlas SRV string, plus `JWT_SECRET` and
`ADMIN_REGISTRATION_CODE`. Allow your IP in Atlas → Network Access.

### 3. Run (both apps)
```bash
npm run dev
```
Or separately:
```bash
npm run dev:backend    # http://localhost:5001
npm run dev:frontend   # http://localhost:5173
```

Vite proxies `/api` to `http://localhost:5001` (same as `PORT` in `backend/.env`).

### Try it
1. Open the frontend URL and register as a prosumer
2. Wait ~1 minute for the meter simulator’s first tick, then reload the dashboard
3. Register a consumer account and browse the marketplace after adding listings

## Folder structure

```
backend/
  config/       MongoDB connection
  models/       User, Listing, Transaction, Wallet, CarbonCredit, MeterReading
  controllers/  auth, listing, meter, transaction, wallet, admin
  routes/       auth, listing, meter, transaction, wallet, admin
  middleware/   JWT auth + role guard
  services/     meterSimulator, matchingEngine
  server.js     API entry point

frontend/
  src/pages/       Landing, auth, prosumer, consumer, admin, shared
  src/context/     AuthContext
  src/components/  Layout, Sidebar, landing sections, ProtectedRoute
  src/api/         axios client
```

## What’s built

- **Auth**: register/login/logout with JWT (httpOnly cookie), role selection
  (prosumer/consumer/admin), protected routes on both sides
- **Smart meter simulator**: background job writing generation/consumption readings
- **Listings**: create/browse/filter marketplace CRUD
- **Transactions + wallets**: purchase flow, top-up, carbon credits on sale
- **Admin**: users, listings, transactions, meter overview
- **Matching engine**: weighted-score ranking (service ready to wire to an endpoint)
