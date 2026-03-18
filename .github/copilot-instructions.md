# Project Guidelines

## Code Style
- Follow the existing React + TypeScript style: functional components, no semicolons, and inline prop types unless a type is reused across files.
- Prefer the `@/` alias for imports from `src/` instead of deep relative paths.
- Keep changes localized. Put route pages in `src/pages`, shared layout in `src/components/layout`, reusable visual building blocks in `src/components/ui`, and cross-cutting state in `src/contexts`.
- Styling is a mix of Tailwind utilities and global CSS in `src/App.css` and `src/index.css`. Preserve that approach instead of introducing CSS modules or a second styling pattern unless the task requires it.

## Architecture
- This is a Vite SPA with React Router. Routing and transition behavior live in `src/App.tsx`.
- Keep static routes before dynamic country routes. The `/:country` and `/:countrySlug/...` routes will swallow more specific paths if ordering changes.
- Provider order matters: `BrowserRouter` -> `AuthProvider` -> `LanguageReset` -> `LocaleProvider` -> `PdfLeadCaptureProvider`.
- Country metadata and routing-localization assumptions live in `src/lib/countries.ts`. Translation copy lives in `src/lib/translations.ts`.

## Build And Test
- Install dependencies with `npm install`.
- Start local development with `npm run dev`.
- Validate production readiness with `npm run build`.
- Run `npm run lint` after code changes.
- There is no formal test suite configured in `package.json`; use build and lint as the required validation baseline unless the task adds targeted tests.

## Conventions
- Locale behavior is intentionally opinionated in `src/contexts/LocaleContext.tsx`: Morocco forces French, several LATAM country routes default to Spanish on first arrival, and locale persistence depends on `localStorage` and `sessionStorage` keys such as `tl_lang`, `tl_last_country`, and `tl_user_chose_lang`. Preserve that flow when editing routing, language selectors, or country navigation.
- Supabase is fail-soft in `src/lib/supabaseClient.ts`. Do not assume env vars are present in local or preview environments, and avoid changes that hard-crash the app when auth configuration is missing.
- When adding or changing a country, product, or localized CTA, update the shared data sources together: route expectations in `src/App.tsx`, country data in `src/lib/countries.ts`, and user-facing copy in `src/lib/translations.ts`.
- Analytics should remain non-blocking. Follow the existing pattern of guarding browser-only APIs and allowing tracking failures without breaking rendering.