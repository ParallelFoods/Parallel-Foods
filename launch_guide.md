# 🚀 Parallel Foods Launch Guide

The code has been successfully connected and pushed to your repository at `https://github.com/ParallelFoods/Parallel-Foods.git`.

## 1. Deploy to Vercel

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

## 2. Post-Deployment Checklist
- [ ] Verify the **Hero** section loads with the premium spice spread image.
- [ ] Scroll down to the **Story** section and ensure the Korea/Mexico animations feel smooth.
- [ ] Test the **Add to Cart** button to see the floating cart count update.
- [ ] Ensure the **Database** is receiving customer/order entries by checking your Supabase dashboard.

---

**Note to Branding Team:** All brand colors and typography can be adjusted in `src/app/globals.css`.
