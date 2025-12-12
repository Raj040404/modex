# Backend Deployment Guide

## 1. Prerequisites
- GitHub Repository with this code.
- A PostgreSQL Database (e.g., from Railway, Supabase, or Render).

## 2. Deploy to Render / Railway

### Steps:
1.  **New Web Service**: Connect your GitHub repo.
2.  **Root Directory**: Set to `backend`.
3.  **Build Command**: `npm install && npx prisma generate && npm run build`
4.  **Start Command**: `npm start`
5.  **Environment Variables**:
    - `DATABASE_URL`: `postgres://user:pass@host:5432/db`
    - `PORT`: `3000` (or leave default if platform handles it)
    - `NODE_ENV`: `production`

### Database Setup
- After deployment, the application needs the tables.
- You can add a build step or pre-deploy command: `npx prisma db push` to sync the schema.

### Verification
- Visit `https://your-app-url.com/health` to see `{"status":"UP"}`.
- Visit `https://your-app-url.com/api-docs` for Swagger UI.
