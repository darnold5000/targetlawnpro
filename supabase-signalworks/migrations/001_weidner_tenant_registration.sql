-- Migration 001: Register Weidner Lawnscape tenant on Signal Works Pro (idempotent).
-- Safe for shared production: only upserts the weidner-lawnscape row; does not alter
-- other tenants or overwrite global table comments.

insert into public.tenants (
  slug,
  display_name,
  status,
  platform_category
)
values (
  'weidner-lawnscape',
  'Weidner Lawnscape',
  'active',
  'services'
)
on conflict (slug) do update
set
  display_name = excluded.display_name,
  status = excluded.status,
  platform_category = excluded.platform_category,
  updated_at = now();

-- Resolve for app env:
--   select id from public.tenants where slug = 'weidner-lawnscape';
