# World Map (Ultimate)

This is the definitive specification for the world map component with interactive continent pins. The map uses **Mercator projection** calculated via `latLngToPercent()` for accurate geographic placement, with strategic **mobile offsets** to prevent overlap and ensure readability.

## Core Goals

✅ **Accurate pin placement** — Each continent pin sits on the correct Mercator-projected location.  
✅ **Europe on Russia** — The "Europe" region pin is positioned over western Russia (lat/lng: 60, 100).  
✅ **No overlap** — On mobile, Europe and Asia pins are offset horizontally and vertically to remain distinct & readable.  
✅ **Logo clear of pins** — The `TrueLegacyLogo` is positioned (top: 18px) so it does not overlap any pin.  
✅ **Readable labels** — Pin labels remain legible at all viewport sizes.

## Pin Coordinates & Offsets

| Region        | Lat/Lng     | Desktop (px)            | Mobile (%) (Optimized)  | Notes                                       |
| ------------- | ----------- | ----------------------- | ----------------------- | ------------------------------------------- |
| North America | 46.5, -96.5 | left: 83, top: 196      | left: 18%, top: 45%     | Top-left on mobile, fully visible           |
| South America | -12, -58    | left: 150, top: 305     | left: 30%, top: 75%     | Bottom-left on mobile, clear separation     |
| **Europe**    | **60, 100** | **left: 320, top: 210** | **left: 52%, top: 25%** | **Upper-middle on mobile, no logo overlap** |
| **Asia**      | **48, 88**  | **left: 370, top: 235** | **left: 75%, top: 45%** | **Right side on mobile, clear from Europe** |
| Africa        | 6.5, 12     | left: 260, top: 280     | left: 50%, top: 65%     | Center-bottom on mobile, balanced position  |

## Implementation Details

### Core Files

- **`src/components/ui/WorldMap.tsx`** — Component logic, pin rendering, responsive offsets
- **`src/index.css`** — Pin styling, animations, label appearance

### Map Container

- Fixed height: **460px** (no responsive height changes)
- Width: 100% for responsive scaling
- Rounded corners: **2xl**

### Logo Positioning

- Position: `absolute`
- Top: **18px** (moved down slightly from 12px to clear pins)
- Left: 50% + `translateX(-50%)` (centered)
- Z-index: 50
- Pointer events: none (transparent to clicks)

### Pin Overlay System

- Overlay div: `position: absolute`, `width: 100%`, `height: 100%`, `zIndex: 100`
- Each pin:
  - Rendered from `CONTINENTS` array
  - Uses `latLngToPercent(lat, lng)` for base projection
  - Mobile check: `window.innerWidth <= 767`
  - Conditional offset applied if mobile + specific continent ID

### Mobile Offset Strategy

- **North America**: Top-left position (18% left, 45% top) — fully visible on mobile
- **South America**: Bottom-left position (30% left, 75% top) — clear separation from North America
- **Europe**: Upper-middle position (52% left, 25% top) — well above Asia, clear of logo
- **Asia**: Right position (75% left, 45% top) — far from Europe, balanced on right side
- **Africa**: Center-bottom position (50% left, 65% top) — stable central position

## CSS Pin Styling

Pin labels render with:

- Background: `rgba(5, 18, 30, 0.88)` (dark overlay)
- Border: `1px solid rgba(245, 166, 35, 0.45)` (orange accent)
- Padding: `4px 10px`
- Font size: `11px`, weight: `700`
- Letter spacing: `0.07em`
- Text transform: uppercase
- Animation: `pinLabelGlow` (2.5s infinite) with subtle opacity pulse

Hover state:

- Background: `rgba(245, 166, 35, 0.18)` (lighter orange tint)
- Border color: `rgba(245, 166, 35, 0.8)` (stronger orange)
- Scale transform: `1.35` on pin dot
- Enhanced glow animation: `1.5s`

## Validation Checklist

- [ ] Europe pin renders over Russia (western portion)
- [ ] Asia pin does not overlap Europe label on mobile
- [ ] Logo does not overlap any pin
- [ ] All labels remain readable and centered
- [ ] Hover/tap interactions trigger correctly
- [ ] Desktop layout is unaffected by mobile offsets
- [ ] No duplicate continents in the CONTINENTS array

## Responsive Behavior

- **Desktop (>768px)**: Fixed pixel offsets (left/top in px), larger spacing, full visibility
- **Mobile (≤767px)**: Percentage-based offsets, strategic spacing to avoid collisions, labels scale appropriately

## Future Tuning

If pins still collide on specific devices:

1. Adjust mobile percentages in the pinning logic (e.g., Europe top from 35% → 32%)
2. Add a CSS media query for ultra-small screens (<360px)
3. Consider label font-size reduction for mobile
4. Add a `@supports` rule for browsers with limited flex/grid support

## Related Files

- `src/App.tsx` — Route integration
- `src/lib/countries.ts` — Continent & country data
- `src/pages/SelectCountryPage.tsx` — Continent navigation handler
