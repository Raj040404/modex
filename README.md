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

## 🚀 Deployment

### 1. GitHub Setup (One-time)
1. **Create Repo**: Go to [GitHub New Repo](https://github.com/new) and name it `modex`.
2. **Push Code**:
```bash
git remote add origin https://github.com/raj040404/modex.git
git push -u origin master
```

### 2. Backend (Render) | [Deploy Here](https://render.com)
- **Repo**: `raj040404/modex`
- **Root Directory**: `backend`
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm start`
- **Env Var**: `DATABASE_URL` = `file:./dev.db` (For SQLite demo)

### 3. Frontend (Vercel) | [Deploy Here](https://vercel.com/new)
- **Repo**: `raj040404/modex`
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Env Var**: `VITE_API_URL` = (Your Backend URL from Step 2)

## Documentation
- [System Design](docs/system_design.md)
- [Backend Deployment](docs/deployment_backend.md)
- [Frontend Deployment](docs/deployment_frontend.md)
