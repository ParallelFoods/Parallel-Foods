# 🚀 Parallel Foods Launch Guide

Follow these steps to push your local code to GitHub and deploy it to Vercel.

## 1. Connect to GitHub

I noticed you already have a repository at `https://github.com/ParallelFoods/Parallel-Foods`. Let's link your local code to it.

Run these commands in your terminal:

```bash
# Initialize git if not already done
git init

# Add the existing remote
git remote add origin https://github.com/ParallelFoods/Parallel-Foods.git

# Add all files
git add .

# Create the initial commit
git commit -m "feat: complete brand foundation and infrastructure"

# Push to the main branch
git push -u origin main
```

## 2. Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)
1. Go to your [Vercel Dashboard](https://vercel.com/new).
2. Find the **Parallel-Foods** repository and click **Import**.
3. Under **Environment Variables**, add the following:
   - `NEXT_PUBLIC_SUPABASE_URL`: (Your Supabase Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_dSydysfaW7o15kMHcYJrQw_tn2WYUbU`
4. Click **Deploy**.

### Option B: Vercel CLI
If you have the Vercel CLI installed:
```bash
vercel login
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL # enter your URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY # enter the key from above
vercel --prod
```

## 3. Post-Deployment Checklist
- [ ] Verify the **Hero** section loads with the premium spice spread image.
- [ ] Scroll down to the **Story** section and ensure the Korea/Mexico animations feel smooth.
- [ ] Test the **Add to Cart** button to see the floating cart count update.
- [ ] Ensure the **Database** is receiving customer/order entries by checking your Supabase dashboard.

---

**Note to Branding Team:** All brand colors and typography can be adjusted in `src/app/globals.css`.
