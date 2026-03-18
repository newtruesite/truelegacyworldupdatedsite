# True Legacy World — Netlify Deployment Guide

Hosting: **Netlify** · Auth backend: **Supabase** (email/password)

---

## 1. Quick deploy

```bash
# Install & build locally first to catch errors
npm install
npm run build
npm run preview   # test production bundle at localhost:4173
```

Push to GitHub → Netlify will auto-deploy on every push to `main`.

---

## 2. Netlify setup (one-time)

1. **Import repo** — Netlify Dashboard → _Add new site → Import an existing project_
2. **Build settings** (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment variables** — Site → _Build & deploy → Environment variables_:

| Variable                 | Where to find it                                              |
| ------------------------ | ------------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | Supabase Dashboard → Project Settings → API → Project URL     |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → anon public key |

4. **Deploy** — trigger a new deploy after adding env vars.

---

## 3. Local development

```bash
cp .env.example .env.local
# Fill in your Supabase values in .env.local
npm run dev
```

> The app renders and works without Supabase env vars — auth features are silently disabled.

---

## 4. Supabase setup (training portal auth)

1. Create a project at [supabase.com](https://supabase.com)
2. Authentication → Providers → enable **Email** (enabled by default)
3. Authentication → Email Templates → customise confirmation email (optional)
4. Add the site URL to: Authentication → URL Configuration → Site URL = `https://your-site.netlify.app`
5. Grab `Project URL` and `anon public` key → paste into Netlify env vars

---

## 5. SPA routing

All routes fall back to `index.html` via `netlify.toml` `[[redirects]]` and `public/_redirects`.  
No additional config needed.

---

## 6. Troubleshooting

| Symptom                               | Fix                                                             |
| ------------------------------------- | --------------------------------------------------------------- |
| Blank page on deploy                  | Check build log — usually a TypeScript error caught by `tsc -b` |
| Login returns 400                     | Verify Supabase env vars are set and redeploy                   |
| 404 on direct URL                     | Confirm `netlify.toml` redirect rule is present                 |
| Auth works locally but not on Netlify | Add site URL to Supabase → Auth → URL Configuration             |
