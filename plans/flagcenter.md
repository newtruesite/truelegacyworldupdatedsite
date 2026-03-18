# Flag Center (Ultimate)

This is the definitive plan for the **country selection grid** so the country cards (flags + text) are centered below the continent name and globe icon, and the flags appear at a consistent, readable size.

## Goals

✅ Center the country grid horizontally under the continent heading and globe icon.  
✅ Prevent the grid from left-aligning when there are fewer countries than the maximum column count.  
✅ Keep the flag cards a consistent minimum width so flag images don't shrink too small.  
✅ Preserve responsive behavior on small screens while keeping layout balanced.

---

## Current Problem

The grid was using a fixed number of columns (e.g., `lg:grid-cols-4`). When there are only 1–3 countries, the grid still reserves 4 columns, so the items line up on the left and leave empty space on the right. This makes the list look off-center and, in some cases, causes cards to shrink and make flags appear small.

---

## Fix Strategy (Implemented)

### 1) Use a responsive auto-fitting grid

Replace fixed column counts with an **auto-fit / minmax** grid:

```tsx
<div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 md:gap-5 pb-12 justify-items-center place-content-center w-full max-w-6xl mx-auto">
```

This ensures:

- The grid adapts to how many cards exist.
- Cards center automatically when there are fewer items than columns.
- The grid still grows/downsizes elegantly with viewport width.

### 2) Force a minimum card width

Add a `minWidth` (and optional `maxWidth`) to the country card container so flags don’t shrink unnecessarily:

```tsx
minWidth: "260px",
maxWidth: "320px",
```

This keeps the flag/preview area consistent even in very wide layouts.

---

## How to Validate

1. Visit a continent with only 1–3 countries (e.g., North America: US + Canada).
2. Verify the cards are centered under the title/globe.
3. Resize the browser: cards should wrap and remain centered.
4. Ensure flags are readable and not overly skinny.

---

## Future Refinements (Optional)

- Add a `max-width` toggle to change the number of columns at very large breakpoints.
- Add an explicit `grid-auto-flow: dense` option if we want card packing behavior for irregular counts.
- If the UI ever needs “exact center” for tiny counts (1–2), you can optionally render a special helper wrapper that adds padding columns.
