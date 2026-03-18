## Plan: LATAM + Global Events Page (Lead Capture + Updated Flyer)

**TL;DR**
Update `/events/:country` so that:

- South‑American country slugs (brazil, mexico, colombia, paraguay) redirect to `/events/latam` and show the LATAM flyer + correct LATAM times + LATAM Zoom link.
- Any other country slug redirects to `/events/global` and keeps the current global event image / registration link.
- Add a “First time joining?” yes/no prompt (persisted in localStorage). If yes, show a lead capture form (name/email/phone) and then reveal the join link; if no, show the join link immediately.

---

## Steps

1. **Confirm routing and redirect behavior** (existing logic in `src/pages/EventsPage.tsx`)
   - Ensure `/events/usa`, `/events/canada`, etc. redirect to `/events/global`.
   - Ensure `/events/latam` is used for `brazil`, `mexico`, `colombia`, `paraguay`.
   - Optionally add a `/events` redirect to `/events/global` (nice to have).

2. **Add LATAM flyer asset**
   - Add the provided flyer image to `public/assets` (e.g., `public/assets/event-latam-flyer.png`).
   - Update `UPCOMING_EVENTS[0].latamImage` in `src/pages/EventsPage.tsx` to point to the new file.

3. **Update event data to match the flyer**
   - Update the event title/date/copy as needed.
   - For LATAM region, update timezones list to match the flyer (e.g., Colombia 7PM, EST 8PM, PST 5PM).
   - Keep the global timezones (or adjust as desired) for `/events/global`.

4. **Implement “First time joining?” UI + lead capture**
   - Add a stateful prompt in `EventsPage` (or a small subcomponent) that asks: “Is this your first time joining?” with Yes/No buttons.
   - Persist the user’s choice to localStorage (so it doesn’t reappear on refresh).
   - If user chooses **No**, reveal a “Join now” link (LATAM zoom link for `/events/latam`, global register link for `/events/global`).
   - If user chooses **Yes**, open a lead-capture modal that collects First Name, Last Name, Email, Phone.
     - Use a Netlify form submission (same pattern as the existing PDF lead capture modal) so leads are captured without needing backend changes.
     - After successful submit, show a thank‑you state and reveal the join link.

5. **UX polish**
   - Use custom SVG/icons for the yes/no buttons (per request) and make the prompt look like a “smart” conversion section.
   - Make sure the prompt + modal are responsive and match the existing Tailwind styling approach.

6. **Verify**
   - Visit `/events/latam` and ensure the LATAM flyer and times are shown.
   - Confirm yes/no prompt behavior (persisting in localStorage and revealing the correct join link).
   - Visit `/events/usa` (or any non-LATAM country) and confirm redirect to `/events/global` and the global page shows the pre-existing event image and link.
   - Run `npm run lint` and `npm run build`.

---

## Relevant Files

- `src/pages/EventsPage.tsx` — main changes (region mapping, event data, lead-capture prompt, join link logic)
- `src/components/ui/PdfLeadCaptureModal.tsx` (reference for Netlify form / modal patterns)
- `public/assets/*` — new LATAM flyer asset

---

## Open Questions / Clarifications

1. Should the prompt be shown every visit if the user clears localStorage (yes, this is fine), its fine

2. Do you want the lead capture form to send any additional hidden metadata (e.g., region, event name, source) in the Netlify form payload? (could be useful for lead segmentation, but not required).

3. Should the “join” link open in a new tab (likely yes) or in the same tab? (suggest new tab for better UX among users who may want to join the Zoom and still have the event page open for reference).

---

_Next step:_ implement the UI changes in `EventsPage.tsx` + add the new asset, then run lint/build to verify.
