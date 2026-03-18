# Map (Ultimate)

This is the definitive plan for the world map experience in the True Legacy site (the map with interactive region pins).

## Goals

- Place each region pin on the correct spot of a _real 2D world map_ (Mercator projection).
- Ensure the pin is correctly positioned over **Russia** for the “Europe” region (as requested).
- Avoid pin/label overlap on mobile (pins should be spaced and not collide).
- Make the mobile map taller so the overlay logo and pins don’t overlap or feel cramped.
- Keep the map UI responsive and maintainable (avoid hardcoded “pixel math” for different viewports).

## Files to update

- `src/components/ui/WorldMap.tsx` – primary pin placement, responsive map height.
- `src/index.css` – global pin label and overlay styling (if label collisions need refinement).

## How the pin system works

- The world map is rendered via **jsVectorMap** using the `world` map.
- Pin positions are calculated using a Mercator projection helper (`latLngToPercent`) and then placed in a full‑overlay `<div>`.
- Each pin has a hover/tap target plus a label.

## Pin placement coordinates (Mercator-based)

| Region        | Goal pin location     | Lat / Lng     | Notes                                  |
| ------------- | --------------------- | ------------- | -------------------------------------- |
| Europe        | Western Russia        | `60, 100`     | Places the pin on Russia as requested. |
| North America | Central North America | `46.5, -96.5` | (existing)                             |
| South America | Central South America | `-12, -58`    | (existing)                             |
| Africa        | Central Africa        | `6.5, 12`     | (existing)                             |
| Asia          | South / central Asia  | `48, 88`      | (existing)                             |

## Mobile improvements

- Increase map container height on mobile so the `TrueLegacyLogo` overlay and the pin labels don’t overlap.
- If pin labels still collide, tune specific `top` offsets (or add slight per-pin offsets) to spread them.

## Future improvements (optional)

- Add a per-pin offset system so overlapping pins (e.g., Europe + Asia) can be nudged independently on small screens.
- Consider adding a simple “pin debug overlay” that shows computed `%` values to help tune pin placements.
- If more regions are added (e.g., Australia, Middle East), add them to the `CONTINENTS` list and follow the same approach.
