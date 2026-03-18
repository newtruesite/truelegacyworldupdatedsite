# ⚠ Archived — see NETLIFY_DEPLOYMENT.md

This document described the old Vercel + Supabase setup.
The site is now hosted on **Netlify**. All setup instructions have been moved to:

👉 [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)

## 1. Architecture Overview

- **Auth Provider:** Supabase (Email/Password).
- **Client Configuration:** `src/lib/supabaseClient.ts` reads environment variables to initialize the client. If variables are missing, the client fails gracefully (logging an error instead of crashing the app).
- **Global State:** `src/contexts/AuthContext.tsx` wraps the app. It checks the active session on mount (`supabase.auth.getSession()`) and listens for changes (`onAuthStateChange`). It exposes `user`, `session`, and `loading` states.
- **Protected Routes:** 
  - `src/components/auth/ProtectedRoute.tsx` wraps pages that require authentication. If a user is not logged in, it redirects them to `/training` (which houses the login/signup UI).
- **UI (Login/Signup):** 
  - The `TrainingPage.tsx` component checks the `user` from `useAuth()`. If no user exists, it displays the Supabase login/signup form inside an `AuroraBackground` card.
  - The old `/login` page (`LoginPage.tsx`) now acts as a simple redirector to `/training`.

## 2. Required Environment Variables

For Supabase to work, your project **must** have the following environment variables configured. 

### Variables Needed

| Variable Name | Description | Where to find it |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard > Project Settings > API > Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase public anonymous key | Supabase Dashboard > Project Settings > API > Project API Keys > `anon` `public` |

### Setting them in Vercel (Production / Preview)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Select the `stackfinder` (True Legacy) project.
3. Navigate to **Settings > Environment Variables**.
4. Add `VITE_SUPABASE_URL` and paste your URL. Select the environments (Production, Preview, Development).
5. Add `VITE_SUPABASE_ANON_KEY` and paste your anon key.
6. **Redeploy** the project to ensure the environment variables are baked into the new build.

### Setting them Locally (Development)

1. In the root of your project (where `package.json` is), create a file named `.env.local`.
2. Add the variables:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-super-long-anon-key-string
   ```
3. Restart your dev server (`npm run dev`).

## 3. Troubleshooting

### Problem: The app shows a blank page on load.
**Check:** Open the browser console. If you see an error related to `createRoot` or React not mounting, ensure there are no syntax errors. Note: Missing Supabase variables will now log an error (`Supabase URL or anon key missing from env; auth features will be disabled.`) but **will not** crash the app.

### Problem: Login or Signup button does nothing / throws an error.
**Check:** 
1. Ensure the Vercel environment variables are correct and you have redeployed.
2. Check the network tab in browser DevTools. If requests to `your-project.supabase.co/auth/v1/...` are failing with 400/401, your keys might be mismatched or email auth might be disabled in Supabase.
3. In Supabase Dashboard > Authentication > Providers, ensure **Email** is enabled.

### Problem: Form says "Passwords do not match".
**Check:** This is client-side validation. Ensure the user is typing the exact same string in the "Password" and "Confirm Password" fields during the Signup flow.

### Problem: I was redirected to `/training` but wanted to access another protected page.
**Check:** The `ProtectedRoute.tsx` sends unauthenticated users to `/training` (which handles login). Once logged in, they must navigate to their destination. For better UX in the future, you can implement a `state={{ from: location }}` redirect back to their original destination after a successful login in `TrainingPage.tsx`.