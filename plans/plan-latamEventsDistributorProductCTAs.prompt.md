# LATAM EVENTS + DISTRIBUTORS + PRODUCT CTA PLAN

## Goal

Make LATAM pages fully Spanish, ensure the LATAM Events page uses a Spanish headline, add missing distributor CTA buttons to all product cards, and improve distributor page usability (Zah’s website button + consistent styling).

---

## 1) LATAM Events Page (Title localization)

### What to do

- When `/events/latam` is loaded, replace the hardcoded event title `TRUE LEGACY MASTERCLASS` with **`CLASE MAGISTRAL SOBRE EL VERDADERO LEGADO`**.

### Where

- `src/pages/EventsPage.tsx`

### Notes

- Non-LATAM regions keep the existing title.

---

## 2) Distributor page: Zah Naderi website button

### What to do

- Add a `website` entry to Zah Naderi’s distributor data.
- Render a website button (same style as Mehdi Cohen’s WhatsApp button) next to Zah’s Instagram button.

### Where

- `src/pages/DistributorsPage.tsx`

---

## 3) Product cards: Add “Talk to a distributor” to all products

### What to do

- Ensure every product card (`Leveluk SD501`, `Leveluk Super 501`, `Leveluk SD501 DX`, `Anespa DX`, `Kangen Wagyu™`, `Kangen Ukon® Sigma`, etc.) includes a “Talk to a distributor” CTA.
- Link should be generated via `getDistributorLink(country?.slug)`.

### Where

- `src/components/products/ProductSection.tsx`

---

## 4) Ensure LATAM pages are fully Spanish

### What to do

- Confirm Spanish copy is used for LATAM (and other South American) country pages.
- Where pages are region-aware (events, country pages, products, distributors), ensure the default language for LATAM routes is Spanish.

### Where to double-check

- `src/contexts/LocaleContext.tsx` (locale logic)
- `src/pages/EventsPage.tsx` (region->language mapping)
- `src/components/products/ProductSection.tsx` (product card copy data)
- `src/pages/DistributorsPage.tsx` (copy consistency)

---

## 5) Full scan + fix (errors, formatting, missing translations)

- Run `npm run build` and `npm run lint` to ensure code compiles and no new errors are introduced.
- Fix any TypeScript or runtime issues exposed by the build.

---

## Verification

1. Visit `/events/latam` and confirm title is in Spanish.
2. Visit `/distributors` and confirm Zah Naderi has a website button styled like the WhatsApp button.
3. Visit any country product list (e.g., `/usa/products`, `/brazil/products`) and confirm every product has a “Talk to a distributor” button linking to the correct distributor page.
4. Confirm LATAM pages are fully Spanish (no stray English phrases).
