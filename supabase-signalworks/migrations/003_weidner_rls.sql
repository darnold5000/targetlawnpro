-- Migration 003: RLS and grants for Weidner Lawnscape tables.
--
-- Access model (matches DAWG training_* pattern, not portal membership alone):
--   - App access requires weidner_staff_profiles for this tenant (per-app gating).
--   - public.is_tenant_member() alone must NOT grant Weidner ops access.
--   - Platform Auth login without a Weidner staff profile → no rows.
--   - Public estimate/contact inserts use service_role server-side only (no anon).

create or replace function public.weidner_is_staff(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.weidner_staff_profiles s
    where s.tenant_id = p_tenant_id
      and s.user_id = auth.uid()
      and s.is_active = true
  );
$$;

create or replace function public.weidner_is_admin(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.weidner_staff_profiles s
    where s.tenant_id = p_tenant_id
      and s.user_id = auth.uid()
      and s.is_active = true
      and s.role in ('owner', 'admin')
  );
$$;

revoke all on function public.weidner_is_staff(uuid) from public;
revoke all on function public.weidner_is_admin(uuid) from public;
grant execute on function public.weidner_is_staff(uuid) to authenticated, service_role;
grant execute on function public.weidner_is_admin(uuid) to authenticated, service_role;

do $$
declare
  t text;
begin
  foreach t in array array[
    'weidner_staff_profiles',
    'weidner_leads',
    'weidner_lead_photos',
    'weidner_lead_notes',
    'weidner_customers',
    'weidner_customer_properties',
    'weidner_estimates',
    'weidner_estimate_items',
    'weidner_jobs',
    'weidner_recurring_services',
    'weidner_activity_log'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    -- Explicit: anonymous clients have no table privileges.
    execute format('revoke all on table public.%I from anon', t);
    execute format(
      'grant select, insert, update, delete on table public.%I to authenticated, service_role',
      t
    );
  end loop;
end $$;

-- Staff profiles: read own row or any row in tenants where you are staff.
drop policy if exists weidner_staff_profiles_select on public.weidner_staff_profiles;
create policy weidner_staff_profiles_select
  on public.weidner_staff_profiles for select to authenticated
  using (
    user_id = auth.uid()
    or public.weidner_is_staff(tenant_id)
  );

-- Only owners/admins manage staff rows (security definer avoids RLS recursion).
drop policy if exists weidner_staff_profiles_modify on public.weidner_staff_profiles;
create policy weidner_staff_profiles_modify
  on public.weidner_staff_profiles for all to authenticated
  using (public.weidner_is_admin(tenant_id))
  with check (public.weidner_is_admin(tenant_id));

-- Ops tables: staff of that tenant only.
do $$
declare
  t text;
begin
  foreach t in array array[
    'weidner_leads',
    'weidner_lead_photos',
    'weidner_lead_notes',
    'weidner_customers',
    'weidner_customer_properties',
    'weidner_estimates',
    'weidner_estimate_items',
    'weidner_jobs',
    'weidner_recurring_services',
    'weidner_activity_log'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', t || '_staff_all', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.weidner_is_staff(tenant_id)) with check (public.weidner_is_staff(tenant_id))',
      t || '_staff_all', t
    );
  end loop;
end $$;

-- Defense in depth: no public/anon policies on Weidner tables.
-- Service role bypasses RLS but still requires GRANT (granted above).
