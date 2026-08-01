# Target Lawn Pro — content notes

Rebranded from the Weidner Lawnscape template. **Do not invent** reviews, team bios, service claims, or contact details.

## Verified public sources

| Field | Value | Source |
|-------|-------|--------|
| Business name | Target Lawn Pro | Google Business Profile |
| Legal name | Target Lawn Pro LLC | Indiana SOS (entity `202107011503438`) |
| Phone | (317) 260-7032 | Google Business Profile |
| Category | Lawn care service | Google Business Profile |
| Google rating | 5.0 (1 review) | Google Business Profile |
| Owner quote | “Target Lawn Pro is your partner to make your lawn look its best!” | Google Business “From the business” |
| Hours note | Opens 9 AM Monday | Google Business Profile |
| City | Plainfield, IN | User + SOS registered office city |
| Registered office | 6 Wedding Lane, Plainfield, IN 46168 | Indiana SOS (not shown on public site — service-area marketing only) |

## Intentionally omitted

- **Public email** — not listed on Google; use phone + estimate form until the client provides one (`NEXT_PUBLIC_CONTACT_EMAIL` / `ADMIN_NOTIFY_EMAIL`).
- **Website URL** — Google listing had no website; default `NEXT_PUBLIC_SITE_URL` is `https://targetlawnpro.com` (confirm domain).
- **Named customer reviews** — only aggregate Google rating is shown; no fabricated testimonials.
- **Owner / team bios** — not verified for marketing use (registered agent on SOS is not published as “our team”).
- **Instagram / social** — none found on the public listing.
- **Detailed service menu** — Google lists “lawn care service” only; site uses generic lawn/maintenance/landscape/hardscape copy marked as contact-for-scope where needed.

## Images still needed from client

Google Business photos could not be downloaded automatically. Replace placeholders under:

- `public/images/target-lawn-pro/hero/hero-main.webp`
- `public/images/target-lawn-pro/gallery/*`
- Service images as available

Until then, the gallery uses copied placeholder lawn photos and labels them accordingly on `/projects`.

## Database / repo naming

- Supabase tenant slug remains `weidner-lawnscape` and tables remain `weidner_*` (Signal Works product namespace).
- Migration `006_weidner_tenant_display_name.sql` updates the tenant `display_name` to **Target Lawn Pro**.
- Env var `WEIDNER_TENANT_ID` is unchanged.

## Env updates for launch

```env
EMAIL_FROM_NAME=Target Lawn Pro
ADMIN_NOTIFY_EMAIL=<owner inbox for lead alerts>
NEXT_PUBLIC_SITE_URL=https://<your-domain>
# Optional when client provides email:
NEXT_PUBLIC_CONTACT_EMAIL=
```
