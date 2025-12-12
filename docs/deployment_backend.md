# Backend Deployment Guide

## 1. Prerequisites
- GitHub Repository with this code.
- **For Production**: A PostgreSQL Database (e.g., from Railway, Supabase, or Render).
- **For Demo**: Detailed below is the SQLite setup (ephemeral).

## 2. Deploy to Render (Free Tier)

### Steps:
1.  **New Web Service**: Connect your GitHub repo.
2.  **Root Directory**: Set to `backend`.
3.  **Runtime**: `Node`.
4.  **Build Command**: `npm install && npx prisma generate && npm run build`
5.  **Start Command**: `npm start`
6.  **Environment Variables**:
    - `DATABASE_URL`: 
        - For SQLite (Demo): `file:./dev.db`
        - For Postgres (Prod): `postgres://user:pass@host:5432/db`
    - `PORT`: `3000`
    - `NODE_ENV`: `production`

### Important Note on SQLite (Demo)
If you use SQLite on Render's free tier:
- The database is a **file** inside the container.
- When Render redeploys or restarts (which happens often on free tier), **the database file will reset**, and you will lose bookings.
- **Solution**: For a real persistent app, use a managed PostgreSQL database (Render provides a managed Postgres service).

### Database Setup (Postgres)
- If using Postgres, run this command via Render Shell or as part of build:
- `npx prisma db push`

## 3. Verification
- Visit `https://your-app-url.com/api-docs` to see Swagger UI.
- Health Check: `https://your-app-url.com/health` returns `{"status":"UP"}`.
