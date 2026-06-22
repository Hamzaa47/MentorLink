# DigitalOcean Deployment Guide

This guide details how to deploy the MentorLink platform (Express Backend + Vite/React Frontend) on **DigitalOcean App Platform** using the pre-configured App Specification file.

---

## 🚀 Deployment Methods

You can deploy the app either using the **App Specification File (Recommended)** or via the **DigitalOcean App Platform Dashboard GUI**.

---

### Method 1: Deploying via App Specification (Recommended & Easiest)

DigitalOcean App Platform supports importing a YAML configuration that specifies the structure and settings of all your services in one click.

1. Log in to the [DigitalOcean Control Panel](https://cloud.digitalocean.com/).
2. Click **Create** (top right) and select **Apps**.
3. Scroll down and click **Deploy Using App Spec** or **Import App Spec**.
4. Upload/drag the [.do/app.yaml](file:///c:/Users/ADMIN/Downloads/MentorLink-main/MentorLink-main/.do/app.yaml) file from this repository.
5. DigitalOcean will automatically detect and configure the two components:
   * **mentorlink-backend** (Web Service on Express)
   * **mentorlink-frontend** (Static Site on React/Vite)
6. Review the components and update the placeholder environment variables (see table below).
7. Click **Deploy**.

---

### Method 2: Deploying via Dashboard GUI (Step-by-Step)

If you prefer to configure the components manually in the DigitalOcean dashboard:

1. Click **Create** -> **Apps**.
2. Select **GitHub** as the source repository, choose `abdul-mannan4/MentorLink` and the `main` branch.
3. On the configuration screen, click **Add Component** to create two separate components:

#### 1. Configure Backend (Web Service)
* **Type**: Web Service
* **Name**: `mentorlink-backend`
* **Source Directory**: `MentorLink-main/server`
* **Build Command**: (leave blank, auto-detected from `package.json`)
* **Start/Run Command**: `npm start`
* **HTTP Port**: `5000`
* **Size**: Basic ($5/mo or xxs-slug)
* **Environment Variables**: Add the backend variables listed below.

#### 2. Configure Frontend (Static Site)
* **Type**: Static Site
* **Name**: `mentorlink-frontend`
* **Source Directory**: `MentorLink-main`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Environment Variables**: Add the frontend variables listed below.

---

## 🔑 Environment Variables Configuration

Ensure you replace the placeholders in the DigitalOcean panel with your real credentials:

### Backend Service (`mentorlink-backend`)

| Key | Scope | Description |
| :--- | :--- | :--- |
| `PORT` | Run Time | `5000` (Port backend listens on) |
| `SUPABASE_URL` | Run Time | Your Supabase project URL (e.g. `https://yourproj.supabase.co`) |
| `SUPABASE_KEY` | Run Time | Your Supabase Anon or Service Role key |
| `FRONTEND_URL` | Run Time | `${mentorlink-frontend.PUBLIC_URL}` (Dynamically binds to the frontend URL!) |

### Frontend Static Site (`mentorlink-frontend`)

| Key | Scope | Description |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Build Time | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Build Time | Your Supabase Anon (Public) key |
| `VITE_API_URL` | Build Time | `${mentorlink-backend.PUBLIC_URL}/api` (Dynamically binds to backend API URL!) |
| `VITE_GROQ_API_KEY` | Build Time | Your Groq API Key (used for AI mentor features) |

---

## ⚡ Key Architecture Advantages in our DO Spec
* **Dynamic Linking**: `VITE_API_URL` uses `${mentorlink-backend.PUBLIC_URL}/api`. This means the frontend automatically finds the backend service without requiring you to copy and paste public domains after deployment.
* **Monorepo Build**: Both frontend and backend build from their respective sub-directories (`source_dir` parameters) while sharing the same repository pipeline.
* **Auto-Deploy**: Enabled `deploy_on_push: true` so any code changes pushed to GitHub automatically trigger fresh builds for both components.
