# Modex Booking System

A scalable, high-performance Ticketing & Booking System built with Node.js, PostgreSQL, and React.

## Features
- **Concurrency Handling**: Uses Postgres `FOR UPDATE` row-level locking to prevent double bookings.
- **Admin Dashboard**: Create shows and manage inventory.
- **Interactive UI**: Visual Seat Map.
- **Tech Stack**:
    - **Backend**: Express.js, TypeScript, Prisma, PostgreSQL, Zod, Swagger.
    - **Frontend**: React, TypeScript, Vite, TailwindCSS.

## Project Structure
- `backend/`: Node.js Application.
- `frontend/`: React Application.
- `docs/`: System Design, Deployment Guides, and Scripts.

## Getting Started

### Backend
1. `cd backend`
2. `npm install`
3. Setup `.env` (see `.env.example` or just `.env`).
4. `npx prisma generate`
5. `npm run dev` (Starts on localhost:3000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Starts on localhost:5173)

## Documentation
- [System Design](docs/system_design.md)
- [Backend Deployment](docs/deployment_backend.md)
- [Frontend Deployment](docs/deployment_frontend.md)
