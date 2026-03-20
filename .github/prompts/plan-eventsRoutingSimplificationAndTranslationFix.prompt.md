# Plan: Events Routing Simplification + Translation Button Fix

## TL;DR
Two issues: (1) Eliminate continent-specific event routes (asia/africa) so every non-LATAM country goes to /events/global. (2) Fix translation buttons (EN/ES/FR) which currently do nothing on EventsPage because it never reads from LocaleContext. Also fix the ES button incorrectly lighting up for pt-locale users in Navbar.

## Decisions
- LATAM countries for events: brazil, mexico, colombia, paraguay → /events/latam
- ALL other countries → /events/global (no /events/asia, /events/africa)
- Default language for /events/latam when no locale preference set: Spanish (es) — via locale context already set for latam country slugs
- Keep 3 language buttons (EN/ES/FR), no PT button added
- Fix: EventsPage reads locale from useLocaleContext instead of hardcoded getRegionLocale()
- Fix: Navbar — remove `locale === "pt" && loc === "es"` fallback condition

## Files to change
1. `src/lib/events.ts` — narrow EventRegion type + COUNTRY_TO_REGION
2. `src/pages/EventsPage.tsx` — remove asia/africa from REGIONS/COUNTRY_TO_REGION, connect to useLocaleContext
3. `src/components/layout/Navbar.tsx` — simplify eventsPath, fix ES active-state bug

---

## Steps

### Phase 1: events.ts type + mapping cleanup
1. Change `EventRegion = 'latam' | 'global' | 'asia' | 'africa'` → `'latam' | 'global'`
2. In `COUNTRY_TO_REGION`: remove india/uae/malaysia (asia) and nigeria/morocco (africa) entries — they'll fall through to DEFAULT_EVENT_REGION ('global')
3. In event data: update any `regions` arrays that reference 'asia' or 'africa' to use 'global'

### Phase 2: EventsPage.tsx overhaul
4. Change `REGIONS` constant from `["latam", "global", "asia", "africa"]` to `["latam", "global"]`
5. In `COUNTRY_TO_REGION` inside EventsPage: remove india/uae/malaysia and nigeria/morocco mappings
6. Import `useLocaleContext` from `@/contexts/LocaleContext`
7. In `EventsPage()`: replace `const lang = getRegionLocale(region)` with locale from context. Use `locale` directly (typed as `"en"|"es"|"fr"|"pt"`), with pt falling back appropriately since LABELS already has a pt key
8. Remove `getRegionLocale` function (no longer needed)
9. Update redirect useEffect: REGIONS is now just latam/global, non-region params redirect to correct target

### Phase 3: Navbar.tsx cleanup
10. Simplify `eventsPath` ternary — remove the inner asia and africa checks:
    ```ts
    const eventsPath = country
      ? ["brazil", "mexico", "colombia", "paraguay"].includes(country.slug)
        ? "/events/latam"
        : "/events/global"
      : "/events/global"
    ```
11. Fix desktop language toggle active condition: remove `|| (locale === "pt" && loc === "es")` → just `locale === loc`
12. Fix mobile menu language toggle same way (line ~454)

---

## Verification
1. Visit /events/latam — should show Spanish by default for latam-locale users
2. Click EN on Navbar while on /events/latam — page should re-render in English
3. Click ES on Navbar while on /events/global — page should re-render in Spanish
4. Visit /events/india (old URL) — should redirect to /events/global
5. Visit /events/nigeria (old URL) — should redirect to /events/global
6. While locale is "pt" (set directly in localStorage) — ES button should NOT light up, no button highlighted
7. Navbar eventsPath: visit country page for India/UAE/Nigeria/Morocco → Events nav link should go to /events/global
8. `npm run build` — no TypeScript errors

---

## Open question
Direct visits to `/events/latam` (bypassing a country page) will now show in whatever locale is in context — typically `en` for a fresh visitor. If you want `/events/latam` to always default to Spanish regardless of Navbar state, we can add a one-time `setLocaleOverride("es")` on mount when region is latam and no explicit user preference exists (`tl_user_chose_lang` key not set in sessionStorage).
