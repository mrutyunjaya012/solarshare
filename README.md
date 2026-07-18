# SolarShare — Peer-to-Peer Solar Energy Trading Platform

MERN stack scaffold for the SolarShare final-year project. This is a working
**Phase 1 + start of Phase 2** foundation, not the full 54-API spec — see
"What's built" and "What's next" below.

## What's built

- **Auth**: register/login/logout with JWT (httpOnly cookie), role selection
  (prosumer/consumer/admin), protected routes on both frontend and backend
- **Smart meter simulator**: a background job that fabricates realistic
  generation/consumption readings for every user once a minute — this is what
  the spec calls "Smart-meter data simulation & ingestion" and it's what
  powers every dashboard downstream
- **Listings**: create/browse/filter/sort (basic marketplace CRUD)
- **Matching engine**: weighted-score ranking (price/distance/rating) — a
  service function ready to wire into a "recommended sellers" endpoint
- **Dynamic pricing engine**: a supply/demand pricing formula, bounded by
  min/max — ready to wire into an admin-configurable pricing route
- **Three role-based dashboards** (Prosumer, Consumer, Admin) with real data
  from the meter simulator, styled to the spec's exact color palette and
  fonts (Poppins/Inter)

## What's next (in build order)

1. Transaction + Wallet models/routes — the "Buy" button currently does
   nothing; wire it to create a Transaction, decrement listing.availableKwh,
   move money between wallets
2. Settlement ledger + platform fee/tax calculation
3. Carbon credit generation on completed transactions (derive CO2 saved from
   kWh sold), then certificate PDF + QR code (`pdfkit` + `qrcode` packages)
4. Admin routes: user management, aggregate stats, grid load dashboard
5. Notifications (start simple: a Notification model + polling; upgrade to
   Socket.io push later — `io` is already attached to `app` in server.js)
6. Disputes module
7. Reports/export (PDF/Excel)

## Getting started

### Backend
```bash
cd server
npm install
copy .env.example .env # then set MONGO_URI, JWT_SECRET and the admin code
npm run dev             # requires nodemon; or `npm start`
```
Needs a running MongoDB instance (local `mongod` or a free MongoDB Atlas
cluster — Atlas is easier if you don't want to install Mongo locally).

### Frontend
```bash
cd client
npm install
npm run dev
```
Visit http://localhost:5173. The Vite dev server proxies `/api` to
`http://localhost:5000`, so both must be running.

### Try it
1. Register as a prosumer (set `solarPanel.capacityKw` via the API/DB for now
   — there's no profile-edit UI yet — so the simulator has something to base
   generation on)
2. Wait ~1 minute for the simulator's first tick, then reload the dashboard
3. Register a second account as a consumer to see the marketplace populate
   once you add listings from the prosumer side

## Folder structure

```
server/
  models/       User, Listing, Transaction, Wallet(TBD), CarbonCredit, MeterReading
  controllers/  auth, listing, meter
  routes/       auth, listing, meter
  middleware/   auth (JWT verify + role guard)
  services/     meterSimulator, matchingEngine, pricingEngine
client/
  src/pages/    Landing, auth/{Login,Register}, {prosumer,consumer,admin}/Dashboard
  src/context/  AuthContext (login/register/logout/session)
  src/components/  Sidebar, StatCard, ProtectedRoute
```
