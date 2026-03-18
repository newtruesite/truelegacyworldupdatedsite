# True Legacy World

Global marketing site for the True Legacy Enagic distributor network. React 19, TypeScript, Vite, Tailwind CSS v4, Netlify.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in Supabase keys (optional — site renders without them)
npm run dev                  # http://localhost:5173
```

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | TypeScript check + Vite production build → `dist/` |
| `npm run preview` | Serve production build at localhost:4173 |
| `npm run lint` | ESLint across `.ts/.tsx` |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| UI | React 19 + TypeScript 5 |
| Build | Vite 7 + `@vitejs/plugin-react` |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"` in `src/index.css`) + `src/App.css` |
| Animations | Framer Motion |
| Routing | React Router v7 (SPA, no SSR) |
| Auth | Supabase (email/password, fail-soft) |
| Forms | React Hook Form + Zod |
| Hosting | Netlify — see NETLIFY_DEPLOYMENT.md |

---

## Project structure

```
src/
├── pages/          # Route-level components — one file per page
├── components/
│   ├── layout/     # Navbar, Footer
│   ├── ui/         # Reusable visual building blocks (map, carousel, modals…)
│   ├── products/   # ProductSection (multi-variant product cards)
│   └── auth/       # ProtectedRoute wrapper
├── contexts/       # AuthContext, LocaleContext, PdfLeadCaptureContext
├── lib/            # countries.ts · translations.ts · products.ts · analytics.ts · supabaseClient.ts
└── utils/          # langDefaults.ts · utils.ts (cn helper)

public/
├── products/       # PNG images — see public/products/README.md for mapping
├── assets/         # Flags, maps, testimonials, leader photos
├── _redirects      # Netlify SPA fallback (/* → /index.html 200)
└── 404.html
```

Import alias: `@/` → `src/` (vite.config.ts + tsconfig.app.json).

---

## Architecture rules

**Route ordering**: Static routes must come before `/:country` and `/:countrySlug/...` in `src/App.tsx`.

**Provider order**:
```
BrowserRouter → AuthProvider → LanguageReset → LocaleProvider → PdfLeadCaptureProvider
```

**Locale rules** (`src/contexts/LocaleContext.tsx`):
- Morocco always forces `fr`
- LATAM slugs (`brazil`, `mexico`, `paraguay`, `colombia`) default to `es` on first visit unless user manually chose a language
- Storage keys: `tl_lang` (localStorage), `tl_user_chose_lang` + `tl_last_country` (sessionStorage)

**Supabase fail-soft** (`src/lib/supabaseClient.ts`): app renders + all routes work when env vars are missing — auth silently disabled.

**Analytics** (`src/lib/analytics.ts`): all calls wrapped in try/catch — tracking failures never break rendering.

---

## Adding or changing content

### New country page
1. Add country object to `COUNTRIES` in `src/lib/countries.ts`
2. Add slug → ISO2 entry in `SLUG_TO_ISO2` for flag images
3. Add copy for all 4 locales (`en`, `es`, `fr`, `pt`) in `src/lib/translations.ts`
4. Add route in `src/App.tsx` if the country needs a custom page

### New product
1. Add definition to `PRODUCTS` in `src/lib/products.ts`
2. Drop PNG (`800x800px+`, transparent bg) in `public/products/<id>.png`
3. Add per-locale product copy in `src/lib/translations.ts` → `products`
4. Optionally add a dedicated page in `src/pages/` and a route in `src/App.tsx`

### Replace product images
Save transparent-background PNGs to `public/products/`. See `public/products/README.md` for exact filenames.

### Edit user-facing copy
All strings in `src/lib/translations.ts`, exported as `t` with keys `en`, `es`, `fr`, `pt`.

---

## Training portal & auth

`/training` has two gates:
1. **Supabase email/password** — form in `TrainingPage.tsx` and a standalone `/login` page
2. **Secret code** — entered after login, persisted in `sessionStorage`

See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for Supabase setup and environment variables.

---

## Deployment

Full guide: **NETLIFY_DEPLOYMENT.md**

```bash
# Always validate before pushing
npm run build && npm run lint
```

`netlify.toml` at root configures:
- Build command + publish directory (`dist`)
- Security headers (HSTS, X-Frame-Options, Referrer-Policy, etc.)
- SPA redirect — all routes → `/index.html`

---

## Products catalog

| Product | ID | Category | Image |
|---------|-----|---------|-------|
| Leveluk K8 | `k8` | ionizer | `k8.png` |
| Leveluk Jr IV | `sd501` | ionizer | `jr-iv.png` |
| Leveluk Super 501 | `sd501_super` | ionizer | `sd501-super.png` |
| Leveluk SD501 DX | `sd501_dx` | ionizer | `sd501-dx.png` |
| Anespa DX | `anespa_dx` | shower | `anespa-dx.png` |
| emGuarde™ | `emguarde` | accessory | `emguarde.png` |
| Kangen Ukon® Sigma | `ukon_sigma` | supplement | `ukon-sigma.png` |
| Kangen Wagyu™ | `kangen_wagyu` | meat | `kangen-wagyu.png` |
| Kangen Air | `kangen_air` | air | `kangen-air.png` |

Definitions: `src/lib/products.ts`

---

## Active countries

`usa` · `canada` · `morocco` · `nigeria` · `colombia` · `paraguay` · `mexico` · `brazil` · `uae` · `india` · `malaysia`

Country metadata (name, locale, flag, YouTube ID, map coords): `src/lib/countries.ts`
# truelegacyworldupdatedsite
