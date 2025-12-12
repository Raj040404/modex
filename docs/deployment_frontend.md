# Frontend Deployment Guide

## 1. Prerequisites
- GitHub Repository.
- Deployed Backend URL.

## 2. Deploy to Vercel

### Steps:
1.  **New Project**: Import from GitHub.
2.  **Root Directory**: Set to `frontend`.
3.  **Framework Preset**: Select `Vite`.
4.  **Build Command**: `npm run build` (Default).
5.  **Output Directory**: `dist` (Default).
6.  **Environment Variables**:
    - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://my-api.onrender.com/api`).

### 3. Verification
- Open the deployed URL.
- Test loading the Shows list (it matches your specific backend data).
