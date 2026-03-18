# Beta Version Test Plan

This is the **ultimate pre-release checklist** for the True Legacy World site (Netlify build). The goal is to ship a polished, secure, responsive, and SEO-friendly version with **no UI glitches**, **no misaligned CTA buttons**, and **no accessibility or security issues**.

---

## ✅ Visual / UX QA (All Devices)

- [ ] **Button text centering**: `Get Free Access` (and other CTAs) must be centered vertically + horizontally on all screen sizes / languages.
- [ ] **No text clipping / breaks**: Review each page on mobile, tablet, laptop, and desktop (use responsive dev tools) and ensure text does not overflow, wrap oddly, or overlap.
- [ ] **Layout breakpoints**: Confirm grid and hero sections behave correctly across breakpoints (320px, 480px, 768px, 1024px, 1440px, 1920px).
- [ ] **Sticky elements**: Sticky footer bar and sticky nav behave correctly and do not hide content.
- [ ] **Localized copy validation**: Confirm each language shows the correct translated text (EN/ES/FR/PT).

---

## ✅ Accessibility & SEO

- [ ] Ensure `<html lang="...">` is updated based on active locale (EN/ES/FR/PT).
- [ ] Validate meta tags (title + description + open graph) are present on all pages.
- [ ] Confirm all external links using `target="_blank"` include `rel="noopener noreferrer"`.
- [ ] Ensure `alt` text exists for all images used in layouts (logos, flags, leader avatars, product images).
- [ ] Ensure there are no console errors (JS or React warnings) on page load / navigation.

---

## ✅ Security Hardening (Netlify / Production)

- [ ] Remove or archive any development-only assets that should not be served from the public output (empty `public/plans/`, test files, etc.).
- [ ] Confirm no API keys or secrets are hardcoded into the repo.
- [ ] Confirm all third-party scripts are loaded via HTTPS.

---

## ✅ Build / Deployment Verification

- [ ] Run `npm run build` and confirm it succeeds with no warnings or errors.
- [ ] Run `npm run lint` and confirm there are no reported issues.
- [ ] Deploy to Netlify and confirm:
  - Site loads without console errors.
  - Site is fully functional behind the production URL.
  - Redirects (if needed) are working (Netlify `_redirects`).

---

## ✅ Early Release Checklist (Before Going Live)

- [ ] Confirm that any placeholder or “test” content has been removed.
- [ ] Confirm there are no stray environment variables, debug flags, or hardcoded staging URLs.
- [ ] Confirm the `robots.txt` file allows indexing (or explicitly disallows if desired).
- [ ] Confirm canonical URL is set consistently for the live domain.

---

## Quick Notes

- The key bug fixed for this release is the **centered `Get Free Access` button text** issue (applies to all languages + all PDF CTA buttons).
- In addition, the site now sets the `<html lang>` attribute dynamically based on locale.

---

> ✅ Use this checklist as the final QA run before handing off to the client.
