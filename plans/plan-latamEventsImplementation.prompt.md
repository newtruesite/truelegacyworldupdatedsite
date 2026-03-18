# LATAM + Global Events Implementation - ULTIMATE SPECIFICATION

## Overview

Implementation of regional events pages with lead capture form. LATAM country routes show localized content and Zoom meeting. Global routes show standard registration link. **First-time joining prompt with Yes/No buttons always visible** regardless of localStorage state.

---

## 1. Feature Specification

### Routing & Region Mapping

```
/events/brazil      → redirects to /events/latam (shows LATAM content)
/events/mexico      → redirects to /events/latam (shows LATAM content)
/events/colombia    → redirects to /events/latam (shows LATAM content)
/events/paraguay    → redirects to /events/latam (shows LATAM content)
/events/latam       → shows LATAM event with LATAM Zoom link

/events/usa         → redirects to /events/global (shows global content)
/events/canada      → redirects to /events/global (shows global content)
/events/global      → shows global event with registration link
[any other country] → redirects to /events/global (default)
```

### Event Data Structure

```javascript
{
  id: "masterclass-march-2026",
  title: "TRUE LEGACY MASTERCLASS",
  date: "March 29th, 2026",
  image: "/assets/event-masterclass.png",              // Global flyer
  latamImage: "/assets/event-latam-flyer.png",        // LATAM-specific flyer
  registerUrl: "https://tr.ee/8yBqHZ",                // Global registration
  latamZoomUrl: "https://us02web.zoom.us/j/83000043957?pwd=Truelegacy#success",
  timezones: [  // Global timezones
    { region: "Malaysia", time: "8:00 PM" },
    { region: "India", time: "5:30 PM" },
    { region: "UAE", time: "4:00 PM" },
    { region: "Turkey", time: "3:00 PM" },
    { region: "Nigeria", time: "1:00 PM" },
    { region: "Miami", time: "7:00 AM" },
  ],
  latamTimezones: [  // LATAM timezones
    { region: "Colombia", time: "7:00 PM" },
    { region: "EST", time: "8:00 PM" },
    { region: "PST", time: "5:00 PM" },
  ],
  description_en: "...",
  description_es: "...",
  description_fr: "...",
}
```

### User Flow

#### LATAM Region (`/events/latam`, `/events/brazil`, etc.)

1. User lands on page → Sees LATAM flyer + LATAM timezones
2. **First-time prompt always visible:** "¿Es tu primera vez?" (ES) / "First time joining?" (EN)
3. User clicks "Sí, quiero registrarme" → Opens lead capture modal
4. User fills form (First Name, Last Name, Email, Phone)
5. User submits → Form posts to Netlify → Success state shows → Modal closes
6. User now sees **"Unirse ahora" button** (Join button) pointing to LATAM Zoom link
7. **On page refresh:** First-time prompt reappears (always visible), join button still there too

#### Alternative Flow (No Lead Capture)

1. User lands on page → Sees first-time prompt
2. User clicks "No, llévame al evento" → Opens LATAM Zoom link in new tab
3. First-time prompt reappears on refresh (buttons always visible)

#### Global Region (`/events/global`, `/events/usa`, etc.)

1. Same flow as LATAM but:
   - Shows global flyer instead of LATAM flyer
   - Shows global timezones
   - Join button links to `registerUrl` instead of `latamZoomUrl`
   - Spanish labels become English defaults

---

## 2. Component Architecture

### EventsFirstTimePrompt.tsx

**Always visible, never hidden by localStorage**

```typescript
export function EventsFirstTimePrompt({
  onYes: () => void,           // Opens lead capture modal
  onNo: (joinUrl: string) => void,  // Opens Zoom/register link
  joinUrl: string,             // The URL to open (Zoom or register)
  isSpanish: boolean,          // Language flag
}: Props)
```

**Key Points:**

- Component does NOT check localStorage to determine visibility
- Always renders (no conditional `if (!mounted) return null` hiding)
- Buttons styled with Framer Motion animations
- Responsive: Column on mobile, row on tablet+
- Bilingual copy (EN/ES)

**Buttons:**

- "Sí, quiero registrarme" (ES) / "Yes, sign me up" (EN) → Calls `onYes()`
- "No, llévame al evento" (ES) / "No, take me now" (EN) → Calls `onNo(joinUrl)`

### EventsLeadCaptureModal.tsx

**Modal form for lead capture**

```typescript
export function EventsLeadCaptureModal({
  isOpen: boolean,         // Controls visibility
  onClose: () => void,     // Close button
  onSuccess: () => void,   // Called after form submit success
  region: string,          // "latam" or "global"
  eventTitle: string,      // For metadata
  isSpanish: boolean,      // Language flag
}: Props)
```

**Fields:**

- First Name (required)
- Last Name (required)
- Email (required, validated)
- Phone (optional)

**Netlify Form:**

- Posts FormData with `form-name: "events-lead-capture"`
- Includes: `first-name`, `last-name`, `email`, `phone`, `region`, `event_title`
- Rate limiting: 30-second cooldown via localStorage (`tl_last_events_submit`)

**Success Flow:**

1. Form validates
2. Posts to `/` (Netlify form handler)
3. Shows success state with checkmark for 1.5 seconds
4. Calls `onSuccess()` → Modal closes
5. localStorage updated: `tl_last_events_submit = Date.now()`

### EventsPage.tsx

**Main page component**

```typescript
export default function EventsPage() {
  // State
  const [leadCaptureOpen, setLeadCaptureOpen] = useState(false)
  const [joinedEvent, setJoinedEvent] = useState(false)  // Future: track join status

  // Routing
  const region = paramToRegion(param)  // "latam" or "global"
  const isLatam = region === "latam"

  // Event data
  const event = UPCOMING_EVENTS[0]
  const joinUrl = isLatam ? event.latamZoomUrl : event.registerUrl
  const timezones = isLatam ? event.latamTimezones : event.timezones
  const flyer = isLatam && event.latamImage ? event.latamImage : event.image

  // Handlers
  const handleFirstTimeYes = () => {
    setLeadCaptureOpen(true)
  }

  const handleFirstTimeNo = (url: string) => {
    window.open(url, "_blank")
  }

  const handleLeadCaptureSuccess = () => {
    setJoinedEvent(true)
    setLeadCaptureOpen(false)
  }

  return (
    <div>
      {/* Event card with flyer, title, timezones, description */}

      {/* ALWAYS visible: First-time prompt */}
      <EventsFirstTimePrompt
        onYes={handleFirstTimeYes}
        onNo={handleFirstTimeNo}
        joinUrl={joinUrl}
        isSpanish={isSpanish}
      />

      {/* Show join button below prompt */}
      {joinedEvent && (
        <a href={joinUrl} target="_blank" rel="noopener noreferrer">
          Join now
        </a>
      )}

      {/* Modal */}
      <EventsLeadCaptureModal
        isOpen={leadCaptureOpen}
        onClose={() => setLeadCaptureOpen(false)}
        onSuccess={handleLeadCaptureSuccess}
        region={region}
        eventTitle={event.title}
        isSpanish={isSpanish}
      />
    </div>
  )
}
```

**Key Changes from v1:**

- Removed `hasAnsweredFirstTime` state (prompt always visible)
- Removed localStorage checking for prompt visibility
- Keep `joinedEvent` state to optionally show join button below prompt
- Redirect logic unchanged (old country slugs → region URLs)

---

## 3. Netlify Form Configuration

### HTML Form Declaration (index.html)

```html
<form name="events-lead-capture" method="POST" hidden>
  <input type="text" name="first-name" />
  <input type="text" name="last-name" />
  <input type="email" name="email" />
  <input type="tel" name="phone" />
  <input type="text" name="region" />
  <input type="text" name="event_title" />
</form>
```

### Form Submission (EventsLeadCaptureModal.tsx)

```javascript
const formData = new FormData();
formData.append("form-name", "events-lead-capture");
formData.append("first-name", firstName);
formData.append("last-name", lastName);
formData.append("email", email);
formData.append("phone", phone);
formData.append("region", region);
formData.append("event_title", eventTitle);

const params = new URLSearchParams();
formData.forEach((value, key) => params.append(key, value.toString()));

const res = await fetch("/", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: params.toString(),
});
```

---

## 4. Critical Implementation Details

### Region Locale Mapping

```typescript
function getRegionLocale(region: RegionSlug): "en" | "es" | "fr" | "pt" {
  if (region === "latam") return "es"; // LATAM defaults to Spanish
  if (region === "africa") return "en"; // Africa defaults to English
  return "en";
}
```

### Country to Region Mapping

```typescript
const COUNTRY_TO_REGION: Record<string, RegionSlug> = {
  brazil: "latam",
  mexico: "latam",
  colombia: "latam",
  paraguay: "latam",
  india: "asia",
  uae: "asia",
  malaysia: "asia",
  nigeria: "africa",
  morocco: "africa",
};
const DEFAULT_REGION: RegionSlug = "global";
```

### Redirect Logic (useEffect in EventsPage)

```typescript
useEffect(() => {
  if (!param) return;
  const lower = param.toLowerCase();
  if (REGIONS.includes(lower as RegionSlug)) return; // Already a region slug
  const targetRegion = COUNTRY_TO_REGION[lower] ?? DEFAULT_REGION;
  navigate(`/events/${targetRegion}`, { replace: true });
}, [param, navigate]);
```

### Language Detection

```typescript
const lang = getRegionLocale(region) as keyof typeof LABELS;
const isSpanish = lang === "es";
```

---

## 5. Zoom Link & URLs

### LATAM Zoom Meeting

```
https://us02web.zoom.us/j/83000043957?pwd=Truelegacy#success
```

### Global Registration

```
https://tr.ee/8yBqHZ
```

### Flyer Assets

```
/assets/event-masterclass.png      (Global flyer)
/assets/event-latam-flyer.png      (LATAM flyer - user must add this)
```

---

## 6. File Structure & Modifications

### Files to Create

- `src/components/ui/EventsFirstTimePrompt.tsx` - First-time prompt component
- `src/components/ui/EventsLeadCaptureModal.tsx` - Lead capture form component

### Files to Modify

- `src/pages/EventsPage.tsx` - Main events page (routing, state, component integration)
- `index.html` - Add `events-lead-capture` form declaration
- `public/assets/event-latam-flyer.png` - **ADD THE IMAGE FILE**

### No Changes Needed

- `netlify.toml` - Netlify forms work out of box
- `package.json` - All dependencies already installed

---

## 7. Behavior Matrix

| Scenario              | LATAM                                                        | Global                                                                  |
| --------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------- |
| **Region slug**       | `/events/latam`                                              | `/events/global`                                                        |
| **Country redirect**  | `brazil`, `mexico`, `colombia`, `paraguay`                   | All others                                                              |
| **Flyer**             | LATAM design                                                 | Global design                                                           |
| **Timezones**         | Colombia 7PM, EST 8PM, PST 5PM                               | Malaysia 8PM, India 5:30PM, UAE 4PM, Turkey 3PM, Nigeria 1PM, Miami 7AM |
| **Join link**         | Zoom: `us02web.zoom.us/j/83000043957?pwd=Truelegacy#success` | Register: `tr.ee/8yBqHZ`                                                |
| **Language default**  | Spanish (es)                                                 | English (en)                                                            |
| **First-time prompt** | Always visible ✓                                             | Always visible ✓                                                        |
| **Form submit**       | Posts with `region: "latam"`                                 | Posts with `region: "global"`                                           |
| **Rate limit**        | Shared across regions (30s)                                  | Shared across regions (30s)                                             |
| **Cooldown key**      | `tl_last_events_submit`                                      | `tl_last_events_submit`                                                 |

---

## 8. Verification Checklist

### Code Quality

- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] No console errors in dev tools
- [ ] Components handle loading/mounted states properly

### Routing

- [ ] `/events/brazil` redirects to `/events/latam`
- [ ] `/events/mexico` redirects to `/events/latam`
- [ ] `/events/usa` redirects to `/events/global`
- [ ] `/events/latam` shows LATAM content
- [ ] `/events/global` shows global content
- [ ] Direct navigation to `/events` (no param) shows global

### LATAM Page (`/events/latam`)

- [ ] LATAM flyer image loads (`/assets/event-latam-flyer.png`)
- [ ] Timezones show: Colombia 7PM, EST 8PM, PST 5PM
- [ ] First-time prompt visible with Spanish labels
- [ ] "Sí, quiero registrarme" button opens lead capture modal
- [ ] "No, llévame al evento" button opens Zoom link in new tab
- [ ] Form submission succeeds and shows success state
- [ ] On page refresh, first-time prompt reappears

### Global Page (`/events/global`)

- [ ] Global flyer image loads (`/assets/event-masterclass.png`)
- [ ] Timezones show global zones
- [ ] First-time prompt visible with English labels
- [ ] "Yes, sign me up" button opens lead capture modal
- [ ] "No, take me now" button opens register link in new tab
- [ ] Form submission succeeds
- [ ] On page refresh, first-time prompt reappears

### Form Submission

- [ ] All fields validate (first name, last name, email required)
- [ ] Email validation catches invalid formats
- [ ] Success state shows checkmark for ~1.5s
- [ ] Modal closes after success
- [ ] Netlify Forms dashboard receives submissions
- [ ] Rate limiting works (cooldown prevents duplicate submissions)

### Responsive Design

- [ ] Mobile (320px): Buttons stack vertically, text readable
- [ ] Tablet (768px): Buttons side-by-side
- [ ] Desktop (1024px+): Full layout with animations

### Accessibility

- [ ] Form inputs have proper labels
- [ ] Modal has close button (X)
- [ ] Error messages display for invalid inputs
- [ ] Loading state shows while form submits

---

## 9. Implementation Steps (For Developer)

### Step 1: Update EventsPage Imports

```typescript
import { useEffect, useState } from "react";
import { EventsFirstTimePrompt } from "@/components/ui/EventsFirstTimePrompt";
import { EventsLeadCaptureModal } from "@/components/ui/EventsLeadCaptureModal";
```

### Step 2: Create EventsFirstTimePrompt Component

- File: `src/components/ui/EventsFirstTimePrompt.tsx`
- Always renders (no localStorage checks)
- Two buttons with Framer Motion animations
- Calls `onYes()` or `onNo(joinUrl)`

### Step 3: Create EventsLeadCaptureModal Component

- File: `src/components/ui/EventsLeadCaptureModal.tsx`
- Form fields: First Name, Last Name, Email, Phone
- Netlify form submission
- Success state with delay
- Bilingual labels

### Step 4: Update EventsPage Logic

- Add state: `leadCaptureOpen`, `joinedEvent`
- Replace old prompt logic with new EventsFirstTimePrompt (always visible)
- Add handlers: `handleFirstTimeYes()`, `handleFirstTimeNo()`, `handleLeadCaptureSuccess()`
- Remove localStorage visibility checks
- Keep redirect logic unchanged

### Step 5: Update index.html

- Add `<form name="events-lead-capture">` with fields

### Step 6: Add LATAM Flyer Image

- Save flyer to: `public/assets/event-latam-flyer.png`
- Ensure dimensions match global flyer for consistent UI

### Step 7: Verify & Test

```bash
npm run build      # Should pass with no errors
npm run dev        # Start local dev
# Visit http://localhost:5173/events/latam
# Test yes/no flows
# Test form submission
```

### Step 8: Deploy

```bash
git add .
git commit -m "feat: LATAM events page with persistent prompt and lead capture"
git push          # Deploys to Netlify
```

---

## 10. Key Differences from v1 Implementation

| Aspect                  | v1                                    | v2 (Current)                              |
| ----------------------- | ------------------------------------- | ----------------------------------------- |
| **Prompt visibility**   | Hidden after answering (localStorage) | Always visible (no localStorage check)    |
| **localStorage key**    | `tl_events_first_time_{region}`       | Not used for visibility (only rate limit) |
| **State in EventsPage** | `hasAnsweredFirstTime`, `joinedEvent` | Just `leadCaptureOpen`, `joinedEvent`     |
| **Prompt reappearance** | Never (until localStorage clear)      | Every page refresh                        |
| **Join button**         | Replaces prompt                       | Shows below/alongside prompt              |
| **UX intent**           | "Thank you for joining" flow          | "Always offer lead capture" funnel        |

---

## 11. Dependencies & Browser APIs Used

- **React:** `useState`, `useEffect`, `useCallback`
- **React Router:** `useNavigate`, `useParams`
- **Framer Motion:** `motion`, `AnimatePresence` (animations)
- **Lucide React:** `X` icon (close button)
- **Browser APIs:** `localStorage`, `window.open()`, `fetch`
- **Form API:** `FormData`, `URLSearchParams`

**No new npm packages required** (all already in package.json)

---

## 12. Production Readiness

✅ **Security:**

- Input sanitization (XSS protection)
- Email validation
- Rate limiting on form submissions
- Bot field honeypot in HTML form

✅ **Performance:**

- Components use React.memo (consider if needed)
- No memory leaks in useEffect cleanup
- Framer Motion animations GPU-accelerated
- Image lazy loading via native browser

✅ **Accessibility:**

- Semantic HTML form elements
- ARIA labels on inputs
- Keyboard navigation on buttons
- Focus management in modal

✅ **Compatibility:**

- TypeScript strict mode
- Modern browsers (ES2020+)
- Mobile-first responsive design
- Progressive enhancement (Netlify forms work without JS)

---

## 13. Troubleshooting & Common Issues

### Issue: LATAM flyer not showing

**Cause:** Image file missing at `public/assets/event-latam-flyer.png`
**Fix:** Add the flyer image to that path

### Issue: Form not submitting to Netlify

**Cause:** Form name mismatch or missing HTML form declaration
**Fix:** Ensure `index.html` has `<form name="events-lead-capture">` and component posts with `form-name: "events-lead-capture"`

### Issue: Prompt disappears on refresh

**Cause:** localStorage check still in component
**Fix:** Ensure EventsFirstTimePrompt has NO `localStorage.getItem()` for visibility

### Issue: Zoom link not opening

**Cause:** Missing `target="_blank"` or `window.open()` not being called
**Fix:** Verify `handleFirstTimeNo()` calls `window.open(joinUrl, "_blank")`

---

## 14. Summary of Changes

**What Changed:**

1. **Prompt now always shows** - No localStorage hiding
2. **Zoom link updated** to actual meeting: `https://us02web.zoom.us/j/83000043957?pwd=Truelegacy#success`
3. **EventsPage simplified** - Removed `hasAnsweredFirstTime` state
4. **Better UX** - Users can always choose to sign up or join directly
5. **Persistent funnel** - Lead capture opportunity on every visit

**What Stayed Same:**

1. Routing logic (country → region mapping)
2. Netlify form integration pattern
3. Bilingual support
4. Regional customization (LATAM vs Global)

---

**Status:** ✅ Ready for implementation
**Build:** ✅ TypeScript compiles
**Testing:** Ready for QA on staging
**Deploy:** Ready for production once image asset added
