-- =============================================================================
-- Weidner Lawnscape — RLS isolation test (shared Signal Works Supabase)
-- =============================================================================
-- Run in SQL Editor AFTER migrations 001–005 and staff provisioning.
-- Uses authenticated JWTs via set_config('request.jwt.claim.sub', …) pattern
-- OR manual verification steps with the JS client.
--
-- Goal: prove
--   1) Every weidner_* table has RLS enabled
--   2) Weidner staff sees only Weidner tenant rows
--   3) Another tenant's authenticated user sees zero Weidner rows
--   4) Anon cannot select/insert Weidner leads
--   5) tenant_id cannot be mutated
--
-- Replace placeholders before running interactive sections.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- A. Structural checks (service role / SQL editor owner)
-- ---------------------------------------------------------------------------

-- A1. All weidner_* tables must have RLS on
select table_name, rls_enabled
from public.weidner_assert_rls_enabled();

-- Expect: every row rls_enabled = true
do $$
declare
  missing int;
begin
  select count(*) into missing
  from public.weidner_assert_rls_enabled()
  where rls_enabled is not true;
  if missing > 0 then
    raise exception 'RLS isolation FAIL: % weidner_* tables missing RLS', missing;
  end if;
  raise notice 'A1 PASS: RLS enabled on all weidner_* tables';
end $$;

-- A2. Bucket must be private
do $$
declare
  is_public boolean;
begin
  select public into is_public
  from storage.buckets
  where id = 'weidner-lead-photos';

  if is_public is distinct from false then
    raise exception 'RLS isolation FAIL: weidner-lead-photos bucket is not private (public=%)', is_public;
  end if;
  raise notice 'A2 PASS: weidner-lead-photos bucket is private';
end $$;

-- A3. Tenant exists
do $$
declare
  tid uuid;
begin
  select id into tid from public.tenants where slug = 'weidner-lawnscape';
  if tid is null then
    raise exception 'RLS isolation FAIL: tenant weidner-lawnscape missing';
  end if;
  raise notice 'A3 PASS: weidner-lawnscape tenant_id=%', tid;
end $$;

-- ---------------------------------------------------------------------------
-- B. Cross-tenant isolation (manual / scripted with two auth users)
-- ---------------------------------------------------------------------------
-- Prerequisites:
--   :weidner_tenant_id  — select id from tenants where slug = 'weidner-lawnscape'
--   :other_tenant_id    — any other active tenant (e.g. dawg-youth-training)
--   :weidner_user_id    — auth user with weidner_staff_profiles row
--   :other_user_id      — auth user WITHOUT weidner_staff_profiles (e.g. DAWG staff only)
--
-- Preferred verification method (app-level, recommended):
--   1. Sign in as Weidner staff → GET /admin/leads shows only Weidner leads
--   2. Sign in as other-tenant staff on Weidner app → /access-disabled
--   3. With other-tenant JWT + anon key, PostgREST:
--        GET /rest/v1/weidner_leads  → 0 rows (or permission denied)
--   4. With anon key only (no JWT):
--        GET /rest/v1/weidner_leads  → permission denied / 0 rows
--        POST /rest/v1/weidner_leads → permission denied
--
-- SQL Editor owner bypasses RLS — do NOT treat editor SELECTs as proof.
-- Use the API (PostgREST) or the block below with role switching if available.

-- B1. Seed a canary lead as service role (cleanup at end)
-- Uncomment and set UUIDs:
/*
do $$
declare
  v_tenant uuid := '<WEIDNER_TENANT_ID>'::uuid;
  v_lead uuid;
begin
  insert into public.weidner_leads (
    tenant_id, first_name, last_name, email, phone, consent_contact, source
  ) values (
    v_tenant, 'RLS', 'Canary', 'rls-canary@example.com', '3175550100', true, 'rls_test'
  )
  returning id into v_lead;
  raise notice 'Seeded canary lead %', v_lead;
end $$;
*/

-- B2. As other-tenant authenticated user (PostgREST), expect 0 rows:
-- curl with Authorization: Bearer <other_user_jwt>
--   /rest/v1/weidner_leads?select=id
-- Expect: []

-- B3. As Weidner staff JWT, expect canary visible:
-- curl with Authorization: Bearer <weidner_staff_jwt>
--   /rest/v1/weidner_leads?email=eq.rls-canary@example.com&select=id
-- Expect: one row

-- B4. tenant_id immutability
/*
do $$
declare
  v_lead uuid;
  v_other uuid := '<OTHER_TENANT_ID>'::uuid;
begin
  select id into v_lead
  from public.weidner_leads
  where email = 'rls-canary@example.com'
  limit 1;

  begin
    update public.weidner_leads set tenant_id = v_other where id = v_lead;
    raise exception 'RLS isolation FAIL: tenant_id mutation was allowed';
  exception
    when others then
      if sqlerrm like '%tenant_id is immutable%' then
        raise notice 'B4 PASS: tenant_id mutation blocked';
      else
        raise;
      end if;
  end;
end $$;
*/

-- B5. Cleanup
-- delete from public.weidner_leads where email = 'rls-canary@example.com' and source = 'rls_test';

-- ---------------------------------------------------------------------------
-- C. Checklist (human sign-off)
-- ---------------------------------------------------------------------------
-- [ ] A1–A3 notices printed PASS
-- [ ] Weidner staff JWT can read Weidner leads via API
-- [ ] Other-tenant JWT gets 0 Weidner rows via API
-- [ ] Anon cannot read/write weidner_leads
-- [ ] Bucket weidner-lead-photos.public = false
-- [ ] Public site estimate form still works (service role server path)
-- [ ] Canary lead deleted
