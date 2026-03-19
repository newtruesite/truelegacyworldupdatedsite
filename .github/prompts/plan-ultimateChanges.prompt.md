# PLAN: Ultimate Site Optimization — Homepage, Map, Testimonials, Auth Testing

## TL;DR

Remove the global "Watch Our Story | Discover True Legacy" video from the homepage (it's redundant and doesn't fit the narrative). Move that video content to Turkey's dedicated page. Redesign the WorldMap pins so **Europe is top-right (where Russia is), Middle East and Asia don't overlap, and mobile viewport is taller**. Fix testimonial image borders to prevent head cutoffs. Test all login flows and verify Netlify auth works correctly. Polish all text, buttons, and mobile responsive behavior across all devices.

---

## Current State

### Homepage Issues

- Lines 269–291 in HomePage.tsx: "Watch Our Story | Discover True Legacy" section with global video (youtubeId: `k38vdhY-oM0`)
- This video is **not Turkey-specific**, duplicates content, and takes up space without clear call-to-action
- **Action:** Delete this entire section

### WorldMap Pin Positioning Issues (Critical)

**Current desktop positions (px):**

- Europe: 320/210 — positioned over western Russia ✓ (correct intent)
- Middle East: 365/265 — **only 5px right of Asia, causes overlap**
- Asia: 370/235 — **overlaps Middle East on desktop, overlaps Europe on mobile**
- Mobile height: 650px (causes Europe pin to sit near logo, cramped)

**Required fix:**

- Europe: Keep at 320/210 (correct)
- Middle East: Move **right** to ~400px (increase spacing)
- Asia: Move **down/right** to 390/260 (below Middle East, prevent overlap)
- Mobile height: Increase to **720px** or **750px** (taller window, more breathing room)
- Recalibrate mobile % positions (52%, 62%, 75% → account for larger viewport)

### Testimonial Cropping (Medium)

- Image container: `md:w-72 md:h-[340px]`, `object-cover` clips photos
- **Risk:** Heads can get cut off if photo doesn't match aspect ratio
- **Fix:** Increase border frame to `md:h-[400px]` or more, consider `object-contain` with background

### Button/Text Issues on Mobile

- Testimonial "Previous"/"Next" buttons may wrap vertically on narrow screens
- Existing CSS has `gap-3 sm:gap-4` but may need explicit `nowrap` + horizontal scroll

### Login/Auth Tests Needed

- Netlify Identity endpoint: `/.netlify/identity`
- Test: signup → login → redirect to /training
- Verify on deployed (not localhost, which uses `https://localhost/.netlify/identity`)
- Test form validation, error messages (incorrect email, password too short, etc.)

---

## Implementation Plan

### Phase 1: Remove Homepage "Watch Our Story" Section (5 min)

**Files to modify:**

- src/pages/HomePage.tsx

**Steps:**

1. Delete lines 260–291 (entire section from "LANDING PAGE VIDEO" comment through end of section)
   - Removes: "Watch Our Story", "Discover True Legacy", VSLPlayer with youtubeId `k38vdhY-oM0`
2. Leave the Leaders Carousel section and everything after it intact
3. Test: HomePage should now jump from World Map → Leaders Carousel

**Verification:**

- npm run build (no errors)
- npm run lint (no TS errors)

---

### Phase 2: Add Turkey Video Section to CountryPage (10 min)

**Files to modify:**

- src/pages/CountryPage.tsx

**Steps:**

1. In CountryPage, after the CTA panel and WhatsApp/Facebook buttons (around line ~1500–1550)
2. Add a new section **only for Turkey** that displays the video
   - Check: `if (country?.slug === 'turkey')`
3. Wrap the VSLPlayer with same styling as homepage:
   ```jsx
   {
     country.slug === "turkey" && (
       <section className="relative py-16">
         <div className="max-w-4xl mx-auto px-6">
           <motion.div className="text-center mb-8">
             <h2>Discover True Legacy</h2>
             <p>Learn our story...</p>
           </motion.div>
           <motion.div>
             <VSLPlayer
               youtubeId={country.youtubeId}
               title="Turkey | True Legacy Story"
             />
           </motion.div>
         </div>
       </section>
     );
   }
   ```
4. Ensure this section appears **after** the hero/CTA panel but **before** the Leaders section

**Verification:**

- Navigate to `/turkey` → should see video section with proper layout
- Navigate to `/usa` → video section should NOT appear
- npm run build passes

---

### Phase 3: Redesign WorldMap Pins & Viewport (15 min)

**Files to modify:**

- src/components/ui/WorldMap.tsx

**Subtask 3a: Fix Pin Positions (Desktop)**
Current → Proposed:

```
Europe:       320/210 → 320/210 (no change, already correct)
Middle East:  365/265 → 400/265 (move RIGHT +35px)
Asia:         370/235 → 390/260 (move DOWN +25px, RIGHT +20px)
Africa:       260/280 (keep as-is, no overlap risk)
```

**Subtask 3b: Fix Mobile Viewport Height**
Current:

```tsx
height: window.innerWidth <= 767 ? "650px" : "460px";
```

Proposed:

```tsx
height: window.innerWidth <= 767 ? "750px" : "460px";
```

**Subtask 3c: Recalibrate Mobile Pin Positions**
Current mobile %:

- Europe: 52%, 22% → **adjust viewport calculation** (taller container may shift y-coordinate)
- Middle East: 62%, 48% → shift to 65%, 48% (move right due to larger viewport)
- Asia: 75%, 38% → shift to 78%, 42% (move right & down)

**Implementation:**

1. Update CONTINENTS array positions OR adjust the hardcoded logic in the map rendering (lines ~150–180)
2. Test on 5 device sizes: iPhone SE (375), iPhone 14/14+ (390/430), Pixel 7 (412), iPad Mini (768), Galaxy Fold (280)

**Verification:**

- Desktop: No overlapping pins, Europe is visibly at "top right", Middle East above Africa, Asia to the right
- Mobile 650px: Logo not overlapped by pins
- Mobile 750px: More breathing room between pins and logo
- npm run build (no errors)

---

### Phase 4: Fix Testimonial Image Borders & Layout (10 min)

**Files to modify:**

- src/components/ui/split-testimonial.tsx
- src/index.css (optional, if needed for mobile adjustments)

**Steps:**

1. Increase desktop image height from `md:h-[340px]` → `md:h-[400px]` (60px taller)
2. Increase mobile min-height from `min-h-[240px]` → `min-h-[300px]`
3. Change `object-cover` → `object-contain` (prevents head clipping, shows full photo)
4. Add `bg-slate-900` to the container so empty space around cropped photos is dark (not jarring)
5. For "Previous" / "Next" buttons (line ~448–470):
   - Ensure they don't wrap: add `flex-nowrap` to the nav row
   - Consider `gap-4 sm:gap-6` (increase spacing on larger screens for breathing room)
   - Test on narrow screens (320px–375px)

**Optional: Adjust button text layout**

- If "Previous" / "Next" still wrap on mobile, add:
  ```css
  @media (max-width: 480px) {
    .testimonial-next,
    .testimonial-prev {
      font-size: 12px;
      padding: 10px 12px;
    }
  }
  ```

**Verification:**

- Desktop: Full head+shoulders visible, no crop
- Mobile: Full photo visible, no cut-offs
- "Previous" / "Next" buttons don't wrap on 320px screen
- npm run build (no errors)

---

### Phase 5: Test Netlify Login (Complete Auth Flow) (20 min)

**Test Environment:**

- Deployed site: https://truelegacyworld.netlify.app (NOT localhost)
- Netlify Identity enabled in Site Settings

**Test Cases:**

| Test                            | Steps                                                                                          | Expected Result                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Signup (Valid)**              | 1. Navigate to /training 2. Click "Create account" 3. Enter email+password 4. Submit           | Confirmation email sent; prompt to check inbox   |
| **Signup (Already Registered)** | Signup with email that exists                                                                  | Error: "Email already registered" (locale-aware) |
| **Signup (Weak Password)**      | Signup with password < 6 chars                                                                 | Error: "Password must be at least 6 characters"  |
| **Login Valid**                 | 1. After signup confirmation, switch to "Sign in" 2. Enter email+password                      | User redirected to /training; authenticated      |
| **Login Invalid Email**         | Login with non-existent email                                                                  | Error: "Incorrect email or password"             |
| **Login Invalid Password**      | Login with correct email, wrong password                                                       | Error: "Incorrect email or password"             |
| **Login Redirect Memory**       | Attempt to access gated page, redirected to login, then login → should return to original page | ✅ Redirect works; session.state.from is used    |
| **Netlify Identity Iframe**     | Check browser DevTools Network tab                                                             | `/.netlify/identity` endpoint loads successfully |
| **Logout**                      | User logs in, then logs out                                                                    | Session cleared; redirected to home              |

**Test on Devices:**

- Desktop Safari/Chrome
- iPhone 14 Safari (test iOS-specific auth flows)
- Android Chrome

**Documentation:**

- Note any errors, unexpected behaviors
- Check console for JavaScript errors
- If auth fails, verify Netlify Site Settings → Identity tab is enabled

**Verification:**

- All login tests pass
- No console errors
- Netlify Identity iframe successfully loads
- Email confirmation flow works

---

### Phase 6: Mobile Responsive Polish (All Devices) (20 min)

**Audit Areas:**

| Device          | Size     | Tasks                                               |
| --------------- | -------- | --------------------------------------------------- |
| **iPhone SE**   | 375×667  | Test nav, buttons don't overflow, text readable     |
| **iPhone 14**   | 390×844  | Testimonials, forms, buttons align correctly        |
| **Pixel 7**     | 412×915  | Check WorldMap pins, logo positioning               |
| **iPad Mini**   | 768×1024 | Ensure map isn't too tall, navigation readable      |
| **Galaxy Fold** | 280×653  | Hardest phone; test extreme narrow width edge cases |

**Tasks per device:**

1. **Text** — No cutting off, clipping, or overlapping
   - Hero heading, subheading fit within viewport
   - Product names, descriptions readable
   - Form labels, inputs legible
2. **Buttons** — Min 44×44px tap target
   - Navigation links responsive
   - CTAs (Join, WhatsApp, etc.) not squeezed
   - Login form buttons full-width or properly spaced
3. **Images** — No overflow, aspect ratio preserved
   - Hero images, product images, testimonial photos centered
   - Map doesn't overflow or cause horizontal scroll (other than intentional)
4. **Map** — Logo visible, pins not overlapped
   - Europe pin not sitting on logo
   - Middle East/Asia have clear separation
   - Zoom/pan doesn't break layout
5. **Testimonials** — Carousel smooth, buttons accessible
   - "Previous" / "Next" don't wrap or truncate
   - Photo carousel scrolls smoothly
   - Navigation dots visible and clickable

**Fix any issues found:**

- Use CSS media queries or inline styles
- Reference src/index.css for mobile-specific rules
- Consider adding to `@media (max-width: 320px)` section if Galaxy Fold has unique needs

**Verification:**

- Physical device testing (iPhone, Android) OR Chrome DevTools emulation (Dimensions: 375×667, 390×844, 412×915, 768×1024, 280×653)
- No horizontal scroll (except intentional carousel)
- All text readable
- All buttons clickable and properly sized

---

### Phase 7: Final Build & Verification (10 min)

**Steps:**

1. Run `npm run lint` → fix any TypeScript/ESLint errors
2. Run `npm run build` → ensure production build succeeds
3. Visual inspection:
   - Desktop: https://localhost:5173/ (after `npm run dev`)
   - Mobile emulation: Chrome DevTools → Toggle Device Toolbar
4. Test critical user flows:
   - Home → click region on map
   - Country page → scroll through content
   - /training → login form
   - Create account → login → training portal
5. Check for console errors (F12 → Console tab)

**Deployment:**

- Push to `main` branch (triggers Netlify auto-deploy)
- Verify deployment: https://truelegacyworld.netlify.app
- Re-run production mobile tests

---

## Files to Modify

| File                                    | Changes                                                                    | Lines                                        |
| --------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------- |
| src/pages/HomePage.tsx                  | DELETE "Watch Our Story" section                                           | 260–291                                      |
| src/pages/CountryPage.tsx               | ADD Turkey-only video section after hero CTA                               | ~1500–1550 (new)                             |
| src/components/ui/WorldMap.tsx          | UPDATE pin positions, mobile height                                        | ~10–40 (CONTINENTS), ~150–180 (render logic) |
| src/components/ui/split-testimonial.tsx | INCREASE image height, change object-cover → contain, adjust button layout | ~345–380, ~448–470                           |
| src/index.css                           | Optional: Add mobile breakpoint rules for buttons/text (if needed)         | ~2000+                                       |

---

## Testing Checklist

- [ ] Phase 1: HomePage build succeeds, layout correct
- [ ] Phase 2: `/turkey` displays video section, other countries don't
- [ ] Phase 3: WorldMap pins positioned correctly (desktop + mobile), no overlaps
- [ ] Phase 4: Testimonial images full-height, no head crop, buttons don't wrap (320px–1920px)
- [ ] Phase 5: Netlify login/signup flows complete successfully (prod deployment)
- [ ] Phase 6: Mobile responsive audit passes on 5 device sizes (no overflow, readable text, 44×44 buttons)
- [ ] Phase 7: `npm run build` succeeds, no console errors, production deploy works

---

## Notes

- **Europe pin placement:** Currently at 60° lat / 100° lng (western Russia) — correct intentionally because "Europe region" in the world map context covers Turkey & surrounding areas
- **Turkey routing:** Turkey is already a full country route in countries.ts, so the video section will only appear on the Turkey-specific page
- **Mobile map height:** Increasing from 650px → 750px will push content down slightly on mobile; verify layout flows nicely
- **Testimonial object-fit:** Switching from `object-cover` to `object-contain` may add whitespace; that's intentional to avoid cropping
- **Login testing:** Ensure Netlify Identity is enabled on the deployed site **before** testing; it won't work on localhost without special setup
- **Deployment:** After pushing to main, verify the Netlify deploy preview and test login flow on the live site (not localhost) to confirm Netlify Identity is working correctly
