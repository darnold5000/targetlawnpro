-- Migration 005: Documented RLS isolation assertions for Weidner on shared DB.
-- Safe / idempotent: creates a SECURITY DEFINER helper used only by the isolation
-- test script (scripts/rls-isolation-test.sql). Does not change product policies.

create or replace function public.weidner_assert_rls_enabled()
returns table (table_name text, rls_enabled boolean)
language sql
stable
security definer
set search_path = public
as $$
  select c.relname::text as table_name, c.relrowsecurity as rls_enabled
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'r'
    and c.relname like 'weidner_%'
  order by c.relname;
$$;

revoke all on function public.weidner_assert_rls_enabled() from public;
grant execute on function public.weidner_assert_rls_enabled() to service_role;

comment on function public.weidner_assert_rls_enabled() is
  'Weidner ops helper: list weidner_* tables and whether RLS is enabled. Used by scripts/rls-isolation-test.sql.';
