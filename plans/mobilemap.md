# Mobile Map (Ultimate)

This is the definitive specification for the **True Legacy World Map** component, optimized for all device types: mobile, tablet, desktop, laptop, and TV displays. The map prevents logo/pin overlap through responsive height scaling and strategic positioning.

---

## Core Goals

✅ **No logo-pin overlap** — Logo positioned high (top: 8px), map taller on mobile (540px).  
✅ **Responsive across all devices** — Mobile (≤767px): 540px, Desktop/Tablet/Laptop/TV (>767px): 460px.  
✅ **Centered, readable pins** — All pins visible, labeled, and non-overlapping at every breakpoint.  
✅ **Consistent branding** — Logo always visible and centered without interfering with map interaction.  
✅ **Touch-friendly mobile** — Taller map gives more vertical space for comfortable tapping on small screens.

---

## Map Container Sizing Strategy

### Responsive Height Logic

```typescript
// Mobile (≤767px): Taller to accommodate pins below logo
height: window.innerWidth <= 767 ? "540px" : "460px";

// Breakpoints:
// - Extra small (≤480px): 540px (full mobile support)
// - Small (481px–767px): 540px (tablet/small device)
// - Medium (768px–1024px): 460px (tablet landscape, small laptop)
// - Large (1025px–1920px): 460px (desktop, laptop, monitor)
// - Extra large (>1920px): 460px (TV, wide displays)
```

### Why This Works

- **Mobile (540px)**: Extra 80px provides vertical breathing room so logo + pins don't compete for space.
- **Desktop+ (460px)**: Standard size is sufficient; pins have more horizontal spread and vertical room naturally.

---

## Logo Positioning

- **Position**: `absolute` (overlaid on map)
- **Top**: **8px** (minimal gap from map edge)
- **Left**: 50% + `translateX(-50%)` (horizontally centered)
- **Z-index**: 50 (below pins but above map regions)
- **Pointer events**: `none` (transparent to clicks, no interaction blocking)

### Why 8px?

- Leaves minimal space between map border and logo.
- Gives 6px buffer above the topmost pin labels when they render.
- Works consistently across all device sizes and rotations.

---

## Pin Placement (Mobile vs Desktop)

All pins use the same **Mercator projection** base (`latLngToPercent`) with strategic mobile offsets:

| Continent     | Base Coords | Desktop Position            | Mobile (540px)          | Notes                           |
| ------------- | ----------- | --------------------------- | ----------------------- | ------------------------------- |
| North America | 46.5, -96.5 | left: 83px, top: 196px      | left: 18%, top: 45%     | Top-left quadrant               |
| South America | -12, -58    | left: 150px, top: 305px     | left: 30%, top: 75%     | Bottom-left corner              |
| **Europe**    | **60, 100** | **left: 320px, top: 210px** | **left: 52%, top: 25%** | **Upper-center, clear of logo** |
| **Asia**      | **48, 88**  | **left: 370px, top: 235px** | **left: 75%, top: 45%** | **Right side, far from Europe** |
| Africa        | 6.5, 12     | left: 260px, top: 280px     | left: 50%, top: 65%     | Center-bottom                   |

---

## Device Breakpoint Strategy

### Mobile (≤480px, Portrait)

- **Map height**: 540px
- **Logo top**: 8px
- **Pins**: Spread horizontally to avoid vertical crowding
- **Use case**: Phones in portrait orientation

### Small Device (481px–767px, Portrait/Landscape)

- **Map height**: 540px
- **Logo top**: 8px
- **Pins**: Same as mobile strategy
- **Use case**: Large phones, small tablets

### Tablet (768px–1024px, Landscape)

- **Map height**: 460px
- **Logo top**: 8px
- **Pins**: Desktop positions (in px, not %)
- **Use case**: iPad, Surface, standard tablets

### Desktop / Laptop (1025px–1920px)

- **Map height**: 460px
- **Logo top**: 8px
- **Pins**: Full desktop layout with px offsets
- **Use case**: Standard monitors, laptops, ultra-wide displays

### TV / Ultra-wide (>1920px)

- **Map height**: 460px
- **Logo top**: 8px
- **Pins**: Desktop positions scale well horizontally
- **Use case**: 4K displays, smart TVs, projection screens

---

## Implementation Checklist

### Code Changes

- [ ] Logo top: 8px (not 14px)
- [ ] Map height: 540px on mobile (≤767px), 460px otherwise
- [ ] All pin offsets finalized per device class
- [ ] No hardcoded max-width on map-wrapper that restricts tall screens

### Testing Checklist (All Breakpoints)

**Mobile Portrait (375px, 414px, 480px)**

- [ ] Logo visible, not overlapping Europe pin
- [ ] All 5 pins visible and tappable
- [ ] Pin labels readable
- [ ] Map scrolls smoothly

**Tablet Portrait (768px, 810px)**

- [ ] Same pin visibility as mobile
- [ ] Logo and pins not crowded

**Tablet Landscape (1024px)**

- [ ] Logo positioned correctly
- [ ] Pins have good spacing
- [ ] Map fits in viewport without scrolling

**Desktop (1366px, 1920px)**

- [ ] Standard appearance
- [ ] All regions visible
- [ ] Hover states work

**TV / Ultra-wide (2560px, 3840px)**

- [ ] Logo centered
- [ ] Pins distributed across full width
- [ ] Labels readable at distance

---

## Future Optimizations

- Add a media query–based height system in CSS if inline logic needs refinement
- Consider a `resize` observer to dynamically adjust pin positions on window resize
- Add keyboard navigation for accessible interaction on all devices
- Consider landscape/portrait orientation detection for mobile optimization

---

## Files Updated

- **`src/components/ui/WorldMap.tsx`** — Logo top (8px), responsive map height (540px mobile / 460px desktop+)
- **`plans/worldmap.md`** — Updated pin coordinate table with optimized mobile positions
