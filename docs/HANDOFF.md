# Weidner Lawnscape — Handoff

## What was reused

| Source | Use |
|--------|-----|
| `signalworks-modules/forms` | Email/phone validation helpers |
| `signalworks-modules/attribution` | UTM / landing / referrer parsing |
| `signalworks-modules/email` | Resend transactional send pattern |
| `signalworks-modules/media-storage` | Tenant-prefixed upload paths |
| DAWG / MA5 | Supabase SSR clients, service role, staff profile access gating |
| `lotus-pet-spa` / `dbat` | Marketing site structure, noindex, footer credit |
| Live site `weidnerlawnscape.com` | Copy, contact, services, reviews, gallery images |

## What was built

- Public marketing site (mobile-first)
- Multi-step estimate request + photo upload + emails
- Contact form
- Shared Supabase schema (`weidner_*`) + RLS + private photo bucket
- Staff login + admin dashboard + lead management
- **Lead → customer conversion** (with property when address present)
- **Lightweight estimate builder** (line items, status, convert to job)
- **Jobs** create/edit/status + schedule fields
- **Recurring services** create/list (no bulk job generation)
- **Customers** list/detail with properties, estimates, jobs, recurring
- Lead photo signed URLs in admin
- Configurable indexing via `NEXT_PUBLIC_ALLOW_INDEXING`
- Seasonal promo banner hook (`src/data/promotions.ts` — empty until owner provides copy)

## Routes

**Public:** `/`, `/services`, `/services/[slug]`, `/projects`, `/about`, `/service-area`, `/reviews`, `/request-estimate`, `/contact`, `/faq`, `/privacy`, `/terms`

**Staff:** `/login`, `/access-disabled`, `/admin`, `/admin/leads`, `/admin/leads/[id]`, `/admin/customers`, `/admin/customers/[id]`, `/admin/estimates`, `/admin/estimates/new`, `/admin/estimates/[id]`, `/admin/jobs`, `/admin/jobs/new`, `/admin/jobs/[id]`, `/admin/recurring`, `/admin/settings`

**API:** `POST /api/estimate`, `/api/contact`, `/api/upload`, `/api/admin/verify-staff`, `/api/admin/leads/[id]`, `/api/admin/leads/[id]/notes`, `/api/admin/leads/[id]/convert`, `/api/admin/leads/[id]/photos`, `/api/admin/estimates`, `/api/admin/estimates/[id]`, `/api/admin/jobs`, `/api/admin/jobs/[id]`, `/api/admin/recurring`, `/api/admin/recurring/[id]`, `/api/admin/customers`

## Missing / deferred (do not invent publicly)

| Item | Notes |
|------|-------|
| Street address | Not published on source site — service-area based |
| Business hours | Source site didn’t publish fixed hours — “By appointment” |
| ZIP code list | Only “Zionsville & surrounding” verified |
| Team bios beyond Cruz | Old site listed John/Sarah/Michael/Emily — read as fabricated; **omitted** |
| Project titles / before-after pairs | Gallery had images only |
| Pricing | Not published |
| Google Business / review platform URL | Not found on source — Instagram CTA used |
| Fertilization detail page | Homepage advertised Launching 2026; dedicated URL 404’d — seeded from homepage copy |
| Active seasonal promotions | Hook ready; list empty until owner provides copy |
| PDF estimate export | Deferred |
| Customer self-service portal | Schema foundations only |
| Stripe | Deferred |
| Live Cal.com scheduling | Preferred date/window on lead form |

## Manual setup steps

1. Read `docs/MIGRATION-SAFETY.md` and `docs/RLS-ISOLATION.md`
2. Apply SQL migrations 001–005 on Signal Works Supabase (004b if bucket insert fails)
3. Run `scripts/rls-isolation-test.sql` (A structural + B API JWT isolation)
4. Set `WEIDNER_TENANT_ID`
5. Create Auth user + `weidner_staff_profiles` owner row (`scripts/grant-staff-access.sql`)
6. Configure Resend domain/from address
7. Follow `docs/LAUNCH-CHECKLIST.md` for end-to-end production flow
8. Deploy to Vercel; keep noindex until launch
9. Set `NEXT_PUBLIC_ALLOW_INDEXING=true` at launch
10. Redeploy after env changes

## Testing completed (local)

- `npm run lint` — pass
- `npm run build` — pass
- `npm test` — tenant_id env + client-rejection unit tests pass
- Public pages render with real content
- Forms validate client/server; demo mode without Supabase
- Admin requires staff profile (access gating)
- Estimate/job/recurring/customer APIs + UI wired (require live Supabase for end-to-end)
- Migrations hardened for shared-DB safety (RLS, immutable tenant_id, private bucket, no anon grants)
