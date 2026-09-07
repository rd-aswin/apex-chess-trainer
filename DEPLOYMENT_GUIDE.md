# Apex Chess Trainer - 100% Free Production Deployment Guide
**Zero-Subscription Commercial Hosting: Hugging Face Spaces (Backend Docker) + Vercel (Frontend CDN)**

This guide walks you through deploying Apex Chess Trainer completely for free ($0.00/month) with high performance (2 vCPUs + 16 GB RAM for Stockfish 19).

---

## Architecture Summary

| Component | Platform | Hardware / Specs | Monthly Cost | Setup Time |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** (React 19 + Vite) | **Vercel** | Global Edge CDN, Free SSL, Custom Domain | **$0.00** | ~3 minutes |
| **Backend** (Node.js + Stockfish 19) | **Hugging Face Spaces** | **2 vCPUs, 16 GB RAM** (Docker) | **$0.00** | ~5 minutes |
| **AI Coach** (Grandmaster Guidance) | **Google Gemini API** | Free Tier (15 RPM / 1M TPM) | **$0.00** | Instant |

---

## Part 1: Deploy Backend to Hugging Face Spaces (5 Minutes)

### Step 1.1: Create a Free Hugging Face Account & Space
1. Sign up or log in at **[huggingface.co](https://huggingface.co)** (no credit card needed).
2. Click on your profile icon in the top right and select **New Space** (or go to [huggingface.co/new-space](https://huggingface.co/new-space)).
3. Fill in the Space settings:
   - **Space name**: `apex-chess-api` (or any name you prefer)
   - **License**: `MIT`
   - **Select the Space SDK**: Choose **Docker** > **Blank**
   - **Space hardware**: Keep the default **CPU Basic • 2 vCPU • 16 GB RAM • Free**
   - **Space visibility**: Select **Public** *(Mandatory: browsers need public access for CORS)*
4. Click **Create Space**.

---

### Step 1.2: Add Your Gemini API Key Secret
1. In your newly created Space, click the **Settings** tab.
2. Scroll down to **Variables and secrets**.
3. Under **Secrets**, click **New secret**:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API Key (e.g. from [aistudio.google.com](https://aistudio.google.com))
4. Click **Save**.

---

### Step 1.3: Push the Backend to Hugging Face
You can deploy your backend to Hugging Face in one of two ways:

#### Method A: Git Push Directly to Hugging Face (Recommended)
In your terminal, add the Hugging Face Space as a remote and push:
```bash
# Replace <your-username> with your Hugging Face username
git remote add hf https://huggingface.co/spaces/<your-username>/apex-chess-api

# Push the commercial branch to Hugging Face main
git push hf commercial:main
```
*(When prompted for credentials, use your Hugging Face username and an Access Token from huggingface.co/settings/tokens with Write permissions).*

#### Method B: Drag & Drop Files via Hugging Face Web UI
1. In your Space, click the **Files** tab.
2. Click **Add file** > **Upload files**.
3. Upload:
   - `Dockerfile`
   - `.dockerignore`
   - `package.json`
   - `package-lock.json`
   - `server/` (the entire folder)
   - `data/` (the entire folder)
   - Rename `HF_SPACE_README.md` to `README.md` and upload it.
4. Click **Commit changes to main**.

---

### Step 1.4: Verify Backend Health
Hugging Face will automatically build your Docker container in ~60–90 seconds. Once the status badge turns **Running**:
* Your direct public API URL will be:
  ```
  https://<your-username>-apex-chess-api.hf.space
  ```
* Test it in your browser:
  - Visit: `https://<your-username>-apex-chess-api.hf.space/`
  - It should respond with:
    ```json
    {
      "service": "Apex Chess Trainer API",
      "status": "online",
      "engine": "ready",
      "level": "Stockfish 19 NNUE (Level 20 Locked)"
    }
    ```

---

## Part 2: Deploy Frontend to Vercel (3 Minutes)

### Step 2.1: Import Repository in Vercel
1. Log in to **[vercel.com](https://vercel.com)** (sign in with GitHub).
2. Click **Add New...** > **Project**.
3. Select your GitHub repository: `rd-aswin/apex-chess-trainer`.
4. Click **Import**.

---

### Step 2.2: Configure Project Settings
In the Vercel project configuration screen:
1. **Framework Preset**: Vite (automatically detected).
2. **Root Directory**:
   - Click **Edit** next to Root Directory.
   - Select the **`client`** subfolder.
   - Click **Continue**.
3. **Branch**: Ensure **`commercial`** is selected (or merge into `main` when ready).
4. **Environment Variables**:
   - Expand the **Environment Variables** section.
   - Add a variable:
     - **Key**: `VITE_API_BASE`
     - **Value**: `https://<your-username>-apex-chess-api.hf.space/api`
       *(Be sure to include `/api` at the end!)*
5. Click **Deploy**.

---

### Step 2.3: Your Live Application
In ~45 seconds, Vercel will complete the build and assign your free live domain:
```
https://apex-chess-trainer.vercel.app
```
*(You can also attach any custom domain for free in Vercel Settings > Domains).*

---

## Part 3: Keeping the Free Backend Active (Optional Keep-Alive)

Hugging Face Spaces (Free CPU tier) automatically sleeps after 48 hours of total inactivity. Waking it up on a cold visit takes ~20 seconds.

If you want your backend to **never sleep** during your marketing campaigns:
1. Go to **[cron-job.org](https://cron-job.org)** (100% free web monitoring service).
2. Create a new cron job:
   - **Title**: `Apex Chess Keep-Alive`
   - **URL**: `https://<your-username>-apex-chess-api.hf.space/`
   - **Schedule**: Every 24 hours (e.g., once daily at 00:00 UTC).
3. Save the job. This ensures your Space is pinged daily and stays permanently awake!
