# Deployment Guide: Vercel + Supabase

This project is built with React + Vite and deployed on **Vercel** with **Supabase** (PostgreSQL database, authentication, and file storage).

---

## 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** → **New Query**, copy the contents of `supabase/schema.sql`, and execute it. This sets up:
   - `site_content` table (stores single-source site data)
   - `ngo_admins` allowlist table
   - `get_public_site_content()` RPC function for public visitors
   - Public storage buckets: `site-images` and `report-files`
   - Strict alt-text verification triggers
3. Go to **Authentication** → **Users** → **Add user** to create your admin account.
4. Copy the new user's UID and run the following in the SQL Editor:
   ```sql
   INSERT INTO ngo_admins (user_id) VALUES ('<user-uuid>');
   ```
5. Retrieve your project credentials under **Project Settings** → **API**:
   - **Project URL**
   - **anon / public key**

---

## 2. Local Environment

Copy `.env.example` to `.env` and enter your credentials:

```ini
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-anon-key
```

Run the local development server:
```sh
npm install
npm run dev
```

---

## 3. Vercel Deployment

1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New...** → **Project** and import this repository.
3. Configure the Project Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the following **Environment Variables**:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase public / anon key
5. Deploy the project. Vercel will build the frontend and serve it with the serverless meta rewriting configured in `vercel.json` and `api/index.js`.

---

## 4. Custom Domain Setup

1. In your Vercel Project, go to **Settings** → **Domains**.
2. Add your domain (e.g., `modeldisabledsocietyrasuwa.org.np`).
3. Add the CNAME or A records specified by Vercel to your DNS provider (e.g., Cloudflare DNS or registrar DNS).
4. Wait for SSL certificate issuance (automatic via Let's Encrypt on Vercel).
