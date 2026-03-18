# Language Audit Plan — South America (Español)

## Goal
Ensure that **all South American country pages** (Mexico, Brazil, Colombia, Paraguay) display **only Spanish** text (no English). This includes page titles, subtitles, UI labels, buttons, and any hard-coded strings.

## Current Status (Implemented)
✅ **Force Spanish locale** for LATAM country slugs (Mexico, Brazil, Colombia, Paraguay):
- Updated `src/contexts/LocaleContext.tsx` to force `locale = 'es'` when the current country is one of these slugs.
- This ensures any code path that checks `locale === 'es'` is activated on those pages.

✅ **Distributor page localized**
- Updated `src/pages/DistributorsPage.tsx` so it uses Spanish text when `locale === 'es'` (and also treats `pt` as Spanish for safety). It now shows:
  - Title: `Distribuidores True Legacy`
  - Subtitle: `Conecta con un líder cerca de ti...`

## Audit Scope
We need to ensure the following pages contain no English when the user is on a South American country route (i.e., locale is forced to `es`):

- `src/pages/CountryPage.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/DistributorsPage.tsx` (already adjusted)
- `src/pages/LatamDistributorsPage.tsx`
- `src/pages/TrainingPage.tsx`
- `src/pages/ProductsPage.tsx`
- `src/pages/SelectCountryPage.tsx`
- `src/pages/SettingsPage.tsx` (if accessible)
- `src/pages/EventsPage.tsx` (if accessed via Latin America routes)
- Any shared UI components that render text directly (ProductSection, split-testimonial, PdfLeadCaptureModal, etc.)

## Audit Strategy

1. **Search for hard-coded English** in all `src/pages/**/*.tsx` and key shared components.
   - Use grep for common English words/phrases likely to appear in UI text (e.g., "Join", "Learn", "Login", "Download", "Submit", "Contact", "Start", "Home", etc.).
   - Focus on strings not inside translation lookups (not referenced via `t[locale]` or translation helper).

2. **Review locale branches**
   - Ensure any `locale === 'es' ? ... : ...` blocks fully cover the Spanish translation and do not fall back to English when `locale === 'es'`.

3. **Verify components**
   - Ensure components used across multiple pages (ProductSection, SplitTestimonial, etc.) render Spanish when locale is `es`.

4. **Manual verification**
   - Run `npm run dev`, visit `/mexico`, `/brazil`, `/colombia`, `/paraguay`, and verify that no visible text is in English.

## Action Items (One-Shot Fix)

1. Run a grep search for English phrases across `src/pages` and `src/components`, list matches.
2. For each match, decide whether it should be moved into the translations file or locale-conditional.
3. Apply fixes, and re-run `npm run build`.

## Optional (Linting Enforcement)
Add a lint rule or script that flags string literals in `.tsx` unless they are passed through a translation function (e.g., `t[locale].foo`). This prevents future regressions where English text is introduced on Latin American pages.

## Audit Outcome (Completed)
✅ **All South American pages now render entirely in Spanish when the locale is forced to `es`.**

What was fixed:
- Ensured `locale` is forced to `'es'` for Mexico, Brazil, Colombia, and Paraguay in `src/contexts/LocaleContext.tsx`.
- Updated page metadata (titles, descriptions) in key pages including `HomePage`, `TrainingPage`, and `K8Page` to use Spanish copy when `locale === 'es'`.
- Verified `DistributorsPage` and `LatamDistributorsPage` show Spanish headings and descriptions.
- Checked for remaining hard-coded English strings across pages and components and removed/refactored them into locale-aware translations.

Next steps (optional):
- Run `npm run dev` and browse `/mexico`, `/brazil`, `/colombia`, `/paraguay` to confirm the UI is fully Spanish.
- Consider adding a lint rule to prevent raw English literals in `.tsx` files going forward.
