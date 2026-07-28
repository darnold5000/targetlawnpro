# Migration safety review — Weidner on shared Signal Works Supabase

Reviewed before apply. Migrations live in `supabase-signalworks/migrations/`.

## Checklist

| Requirement | Status |
|-------------|--------|
| Every `weidner_*` table includes `tenant_id` FK → `tenants` | Yes (002) |
| RLS enabled on every exposed Weidner table | Yes (003) |
| Policies use app staff helpers (DAWG-style), not portal membership alone | Yes — `weidner_is_staff` / `weidner_is_admin` (003) |
| Private photo bucket not publicly readable | Yes — `public=false`, no anon policies (004) |
| `WEIDNER_TENANT_ID` server-only, not from form input | Yes — `getWeidnerTenantId()`; APIs reject client `tenant_id` |
| Service role only in server modules | Yes — `createServiceClient()` in server routes only |
| Namespaced objects (`weidner_` prefix) | Yes — no collision with `ma5_`, `training_`, platform tables |
| Idempotent tenant upsert | Yes (001) — does not touch other tenants |
| Does not overwrite global `tenants` table comment | Fixed (001) |

## Why not `is_tenant_member` alone?

`public.is_tenant_member()` is the platform portal membership helper. A Signal Works Clients member or DAWG staff must **not** automatically access Weidner ops data.

Weidner follows the same per-app pattern as DAWG (`training_is_staff`): access requires an active `weidner_staff_profiles` row for that tenant. Platform Auth login without that row → `/access-disabled`.

## Apply order

1. `001_weidner_tenant_registration.sql`
2. `002_weidner_schema.sql`
3. `003_weidner_rls.sql`
4. `004_weidner_storage.sql` — if bucket insert fails with ownership error, create private bucket in Dashboard then run `004b_weidner_storage_policies_only.sql`
5. `005_weidner_rls_assertions.sql`
6. Run `scripts/rls-isolation-test.sql` (sections A; then B via API with two JWTs)
7. Set `WEIDNER_TENANT_ID` from `select id from tenants where slug = 'weidner-lawnscape'`
8. Provision staff (`scripts/grant-staff-access.sql`)

## Deferred (out of launch scope)

Invoicing, Stripe, routing, crew assignment, weather automation, customer portal.
