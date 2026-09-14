# Provider-neutral platform boundary

True Legacy must remain usable while its hosting, automation, and CRM options evolve. Cloudflare is not a runtime requirement.

## Current application core

- The frontend is a standard Vite/React build. Any static host that supports a single-page-app fallback can serve `dist/`.
- Supabase remains the authoritative application layer for authentication, memberships, distributor attribution, leads, bookings, permissions, and member preferences.
- Existing links, analytics parameters, purchase routing, training access, and CRM ownership must keep working if the frontend host changes.
- The current Vercel configuration is a deployment target, not an application dependency.

## Future CRM and automation integration

GoHighLevel or another platform may be added later as an optional integration. It must not become the source of truth for True Legacy access control or distributor ownership.

The integration boundary is:

1. A True Legacy event occurs, such as a lead submission, booking, or approved member update.
2. A protected server-side adapter validates the event and maps it to the selected provider.
3. The adapter sends only the fields required for that workflow.
4. The provider response and external record ID are recorded without changing the original True Legacy owner.

No CRM private token may be placed in browser code or a `VITE_*` environment variable. Tokens belong only in protected server-side secrets. Webhook requests must be authenticated, idempotent, logged, and safe to retry.

## Portability rules for new work

- Do not import Cloudflare, GoHighLevel, or another vendor SDK directly into page components.
- Keep paid integrations optional; core member and public-site flows must have a working fallback.
- Put future provider-specific code behind a small server-side adapter.
- Preserve a clean export path for contacts, bookings, content metadata, and member preferences.
- Never make a vendor outage block login, private training authorization, distributor landing pages, or purchase attribution.
- Test the production build before deployment and keep the current live release available for rollback.

## Decision deferred safely

Development can continue without Cloudflare and without a GoHighLevel subscription. When a provider is selected, connect only the workflows that benefit from it, such as welcome sequences, reminders, pipeline automation, and admin notifications. The website and private member ecosystem should continue to operate independently.
