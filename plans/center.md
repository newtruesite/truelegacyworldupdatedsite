# Centering UI Plan

## Goals

- **Center the top navigation bar** (Home, Training, Events, Distributors, Products, Countries, Community) so the items appear in a centered row.
- **Center all page text** across the site (no left-aligned paragraphs, headings, or sections).
- Ensure buttons and interactive elements are also centered by default.
- Keep the layout responsive and readable.

## Strategy

### 1) Center the top navigation bar

- Update `src/components/layout/Navbar.tsx` so the desktop nav links are centered within the header.
- Keep the logo on the left (for branding) while keeping the navigation block centered.
- Ensure language toggles and CTA buttons are also centered within the top bar (not pushed to the far right).

### 2) Center all page text

- Add a global CSS rule in `src/index.css` (or `src/App.css`) to set `text-align: center` for the entire `body`.
- This will ensure that all headings, paragraphs, and inline text default to centered.

### 3) Ensure consistency and avoid conflicts

- Remove explicit `text-left` classes from components where they exist (e.g. dropdown or grid layouts) so they don’t override the global centering rule.
- When necessary, keep specific elements left-aligned only if the design absolutely requires it, but the goal is to minimize those.

### 4) Validate and optimize

- Run `npm run lint` + `npm run build` to ensure there are no TypeScript or build errors.
- Preview pages to ensure text is centered and the layout remains usable on mobile/desktop.

## Next steps (after implementation)

- Validate on the key pages: Home, Country, Products, Distributors, Events, Training.
- Check for any leftover uncentered text and adjust accordingly.
- If desired, create a small utility component (e.g. `<Center>` wrapper) for explicit centering in special cases.
