# Parallel Foods - Premium Seasoning Blends

Welcome to the codebase for **Parallel Foods**, a story-driven e-commerce experience bridging the culinary heritage of Korea and Mexico.

This is a modern, full-stack Next.js application using the App Router, Tailwind CSS, and Supabase.

## Tech Stack
- **Framework:** Next.js (App Router, React Server Components)
- **Styling:** Tailwind CSS (v4 css variables)
- **Database/Backend:** Supabase (PostgreSQL, Edge Functions, Auth)
- **Animations:** Framer Motion

---

## 🎨 Branding Team Instructions

The visual identity of Parallel Foods is controlled centrally through Tailwind CSS variables. 
To modify the brand colors, typography, and aesthetic:

1. Open `src/app/globals.css`.
2. Locate the `@theme` and `:root` sections under `@layer base`.
3. Modify the HEX values to adjust the warm, earthy tones:
   - `--primary`: Rust/Orange/Brown for primary actions and accents.
   - `--accent`: Terracotta for highlights.
   - `--background` & `--foreground`: Light and dark modes.

---

## ⚙️ Environment Variables Setup

Before running the application, you must connect it to Supabase.

1. Rename `.env.example` to `.env.local` or create a new `.env.local` file in the root directory.
2. Add your Supabase keys from your dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_dSydysfaW7o15kMHcYJrQw_tn2WYUbU
```

*(Note: The `ANON_KEY` provided above is safe to expose in the public frontend, but ensure you also have your URL set up).*

---

## 🚀 Deployment (Vercel & GitHub)

### 1. Push to GitHub
Initialize your Git repository and push your code:
```bash
git init
git add .
git commit -m "feat: initial commit for Parallel Foods"
git branch -M main
git remote add origin https://github.com/your-username/parallel-foods.git
git push -u origin main
```

### 2. Deploy via Vercel CLI
If you have the Vercel CLI installed (`npm i -g vercel`), you can deploy directly from your terminal:
```bash
# Link the project to your Vercel account
vercel link

# Pull environment variables if set in dashboard
vercel env pull .env.local

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 3. Deploy via Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import your GitHub repository (`parallel-foods`).
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will automatically detect Next.js and build it.

---

## 📦 Setup & Development
```bash
npm install
npm run dev
```

Open `http://localhost:3000` to view the local server.
