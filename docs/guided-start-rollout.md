# Guided start: first Phase 1 release

The Today page adds an optional three-question starting plan (focus, experience, weekly time), saved as `tl_starting_plan` in the signed-in user's Supabase metadata. These values personalize resource links only. They do not confer membership, admin status, mentor status, or access. Existing database membership authorization remains in place.

Contact next-step text is derived from CRM status. The daily queue counts each contact once and excludes closed/converted contacts from sales follow-ups. No messages are sent automatically, and no lead ownership or status is changed.

Account navigation reads membership outside the auth callback to avoid holding the auth session lock during a database request. Today handles load failures with retry and links to existing tools, tolerates unavailable learning/call data, and does not claim empty training is completed.

## Verification

- Run `npm run build`.
- Start Vite on localhost port 5187, then run `node scripts/check-guided-start.mjs`.
- Browser checks use intercepted Supabase fixtures exclusively. They cover signed-out/inactive access, save/reload, save failure retaining input, duplicate queue prevention, next-step copy, mobile width, partial data, retry, and browser exceptions.
- Real signed-in account persistence still needs a member smoke test: open Today, save preferences, refresh, confirm the same preferences, and open the recommended links.
- No packages, subscriptions, schema migrations, video uploads, or existing member records are changed by deployment.

## Rollout and rollback

Publish through the existing Git/Vercel workflow after the build and browser checks pass. Confirm the production bundle contains the new starting-plan text and that the signed-out page still requests login. If the new experience causes a regression, revert only the guided-start release commit and redeploy. The preference metadata is harmless to the previous version and can remain in place.

## Antigravity continuation prompt

Continue True Legacy Phase 1 without paid upgrades. Preserve the existing site, original logo, distributor attribution, purchase links, CRM ownership, authentication, training and booking workflows. Begin by inspecting the current branch and this release's files; do not reimplement completed features. Today now has optional saved starting preferences and CRM status-based suggestions. Verify it using an authorized member account. Then implement the next bounded slice: a pre-call questionnaire integrated with existing booking records and visible only to the appropriate member/assigned presenter. Inspect the real schema and row-level security before choosing storage. Retain existing booking behavior for members who skip optional questions. Do not use browser storage as the authoritative source of questionnaire records. Do not introduce a paid service, paid courses, AI usage, mass messaging, or public access to private training. Test the affected flow, provide a preview and rollback path, and use the existing deployment workflow. Report any missing access instead of inventing successful verification.

The pre-call questionnaire, mentor assignment, community feed, testimonials, automated email, and private video hosting are future slices, not included in this release.
