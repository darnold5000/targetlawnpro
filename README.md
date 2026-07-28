# Weidner Lawnscape

Marketing website and lightweight operations portal for [Weidner Lawnscape](https://weidnerlawnscape.com) — lawn care and landscaping in Zionsville, Indiana.

Built on the Signal Works stack: Next.js App Router, Tailwind, shared Supabase Auth/DB, Resend.

## Local setup

```bash
npm install
cp .env.example .env.local
# fill Supabase + Resend + WEIDNER_TENANT_ID
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See `.env.example`.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` enables indexing; default/staging stays `noindex` |
| `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` | Shared Signal Works Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only lead inserts & uploads |
| `WEIDNER_TENANT_ID` | `select id from tenants where slug = 'weidner-lawnscape'` |
| `RESEND_API_KEY` / `EMAIL_FROM` / `ADMIN_NOTIFY_EMAIL` | Transactional email |

Without Supabase, estimate/contact forms run in **demo mode** (log + success UI, no persistence).

## Database migrations

Apply in order on the shared Signal Works Supabase project:

`supabase-signalworks/migrations/`

1. `001_weidner_tenant_registration.sql`
2. `002_weidner_schema.sql`
3. `003_weidner_rls.sql`
4. `004_weidner_storage.sql` (or Dashboard bucket + `004b_…`)
5. `005_weidner_rls_assertions.sql`

Then:

- Set `WEIDNER_TENANT_ID` from `select id from tenants where slug = 'weidner-lawnscape'`
- Run `scripts/rls-isolation-test.sql` (structural + API JWT isolation)
- Provision staff via `scripts/grant-staff-access.sql`

See `docs/MIGRATION-SAFETY.md`, `docs/RLS-ISOLATION.md`, and `docs/LAUNCH-CHECKLIST.md`.

Valid login alone is not enough — a `weidner_staff_profiles` row is required (per-app access gating).

## Content management

Public copy lives in:

- `src/config/site.ts` — business contact & service area
- `src/data/services.ts`, `reviews.ts`, `gallery.ts`, `faqs.ts`, `about.ts`

Do not invent reviews, team bios, pricing, or service areas. See `docs/HANDOFF.md`.

## Admin

- `/login` — staff login (password visibility toggle)
- `/admin` — dashboard
- `/admin/leads` — lead inbox + detail (status, notes, convert, create estimate/job, signed photos)
- `/admin/customers` — CRM records from converted leads
- `/admin/estimates` — lightweight line-item estimates
- `/admin/jobs` — schedule/status tracking
- `/admin/recurring` — weekly/seasonal service records (no bulk job generation)

## Deployment

Deploy to Vercel. Set env vars per environment. Keep `NEXT_PUBLIC_ALLOW_INDEXING=false` on preview/demo until launch.

## Reuse

Adapted from Signal Works modules (copied into this client repo — not extracted):

- forms validation patterns (`signalworks-modules/forms`)
- attribution UTM parsing (`signalworks-modules/attribution`)
- email/Resend patterns (`signalworks-modules/email`)
- media storage bucket conventions (`signalworks-modules/media-storage`)
- auth recovery / access gating patterns (DAWG / MA5)

## Scripts

```bash
npm run lint
npm run build
```
