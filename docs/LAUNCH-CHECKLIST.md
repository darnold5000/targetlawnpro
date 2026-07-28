# Launch checklist — Weidner Lawnscape

## Before applying migrations

- [x] Review `docs/MIGRATION-SAFETY.md`
- [x] Confirm `weidner_` prefix registered in shared-supabase products map
- [x] Confirm RLS isolation plan in `docs/RLS-ISOLATION.md`

## Apply (shared Signal Works Supabase)

1. [ ] `001_weidner_tenant_registration.sql`
2. [ ] `002_weidner_schema.sql`
3. [ ] `003_weidner_rls.sql`
4. [ ] `004_weidner_storage.sql` (or Dashboard bucket + `004b`)
5. [ ] `005_weidner_rls_assertions.sql`
6. [ ] Run `scripts/rls-isolation-test.sql` sections A1–A3
7. [ ] API cross-tenant JWT test (section B) — **do not rely on SQL Editor alone**

## Configure

- [ ] `WEIDNER_TENANT_ID` from `select id from tenants where slug = 'weidner-lawnscape'`
- [ ] `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Resend: `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFY_EMAIL`
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] Keep `NEXT_PUBLIC_ALLOW_INDEXING=false` until final approval
- [ ] Provision staff: `scripts/grant-staff-access.sql`

## Production flow test

- [ ] Submit estimate
- [ ] Upload photos
- [ ] Customer + admin emails received
- [ ] Open lead in admin
- [ ] Add note + change status
- [ ] Convert lead → customer
- [ ] Create estimate
- [ ] Convert estimate → job
- [ ] Create recurring service
- [ ] RLS: normal authenticated non-Weidner user cannot see Weidner rows

## Soft launch

- [ ] Owner review of copied content/images
- [ ] Connect final domain
- [ ] `NEXT_PUBLIC_ALLOW_INDEXING=true` only after approval + redeploy

## Deferred

Invoicing, payments, routing, crew assignment, weather automation, customer portal.
