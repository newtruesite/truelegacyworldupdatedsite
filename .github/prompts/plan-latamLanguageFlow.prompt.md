## Plan: Kangen Air product page consistency and translation rollout

TL;DR: Add a dedicated Kangen Air page, add localized copy and instruction flow, ensure the global product discovery path includes it, and verify "Talk to a distributor" CTA exists in every UX path.

Steps:
1. Add route handlers in `src/App.tsx`:
   - `/:countrySlug/kangen-air` -> new `KangenAirPage` component.
   - `/kangen-air` redirect to `/usa/kangen-air` (or direct route using default fallback).
   - Keep static routes before `/:country` per existing app order.
2. Create `src/pages/KangenAirPage.tsx` modeled after `K8Page.tsx` and `EmGuardePage.tsx`.
   - Include SEO, Navbar, page hero with localized headline/subheadline.
   - Add product image, features list, specs.
   - Add a new section for user instructions.
   - Add application flow (sales start, pricing, shipping, distributor contacts, etc.) from user copy.
   - Add a clear `Talk to a distributor` button linked to `getDistributorLink(countrySlug)`.
   - Add a `mailto:kangenair@enagicsg.com` button at minimum.
   - Add regional button to `/:countrySlug/training` and any official product docs held in copy.
3. Update product definition in `src/lib/products.ts` (already exists but verify):
   - `kangen_air.enagicProductUrl` may remain `mailto:kangenair@enagicsg.com`.
   - Add `pdfGuideUrl` if there is a known doc; else leave undefined.
4. Expand translation data in `src/lib/translations.ts` under `t.en/kangen_air`, `t.es/kangen_air`, `t.fr/kangen_air`, `t.pt/kangen_air`.
   - New fields: `badge`, `headline`, `headlineAccent`, `sub`, `featuresTitle`, `instructionsTitle`, `instructions`, `orderingTitle`, `talkToDistributor`, `contactSupport`, etc.
   - Ensure string values are localized (use your own best translation or placeholders initially, using existing patterns for partials).
5. Update `ProductsPage` category card logic for `kangen_air` ideally to route to the new KangenAirPage (like k8/emguarde):
   - Currently all non-k8/emguarde items show static description with distributor link.
   - Add `id === 'kangen_air'` branch in `CATEGORY_ORDER` map to link to `/${countrySlug}/kangen-air` for locale-aware deep dive.
6. Add a new “Kangen Air instructions” section to `ProductSection` if product is selected (or new KangenAirPage) with localized content pulled from t[locale].
   - Could be an additional block under product card in `ProductsPage` (for Kangen Air row) instead of full page.
7. Ensure talk to distributor button exists in all relevant UI points:
   - `ProductSection` card-level already uses `getDistributorLink(country?.slug)` (verify for kangen_air route)
   - `ProductSection` dual-package section has it.
   - `KangenAirPage` will include it.
   - `K8Page`, `EmGuardePage` already have it; follow same pattern.
8. Test and validate:
   - run `npm run lint` and `npm run build`.
   - manual browser check: `/products`, `/usa/kangen-air`, `/canada/kangen-air`, `/latam/products`, `/brazil/kangen-air` if included.
   - verify localized strings for en/es/fr/pt.
   - verify button and link states (redirect to distributor page or email open).

Relevant files:
- `src/App.tsx`
- `src/pages/KangenAirPage.tsx` (new file)
- `src/pages/ProductsPage.tsx`
- `src/components/products/ProductSection.tsx`
- `src/lib/translations.ts`
- `src/lib/products.ts`
- `src/lib/distributorRouter.ts` (maybe unchanged but important behavior)

Verification:
1. Build + lint to confirm no TypeScript errors.
2. Navigate in browser on both `usa` and `canada` country pages to confirm Kangen Air is present and calls to action exist.
3. Validate content translation toggles in 4 languages.
4. Confirm `Talk to a distributor` flows through `getDistributorLink` and mailto.
5. Confirm no route conflict with `/:country` and static pages.

Decisions:
- Prefer per-product detail page (+ route) for Kangen Air for entirely consistent behavior with K8/EmGuarde.
- Keep shipping and pricing copy in static page sections (localized text) without embedding internal business logic.
- Avoid breaking existing CountryPage listing and preserve existing country inclusion rules (USA+Canada only for kangen_air).

Further Considerations:
- Should KangenAir details be split into `src/components/products/KangenAirDetails.tsx` for reusability?
- If individual routes are not acceptable, alternative is to keep the enriched information inside `ProductSection` card and `CountryPage` only.
- Double-check if another data file controls product availability in the current route (existing static mapping includes USA/Canada).
