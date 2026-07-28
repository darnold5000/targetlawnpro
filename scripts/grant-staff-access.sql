-- After migrations 001–004 and creating an Auth user, provision Weidner staff access.
-- Replace the placeholders, then run on Signal Works Supabase.

-- select id from public.tenants where slug = 'weidner-lawnscape';
-- select id, email from auth.users where email = 'you@example.com';

insert into public.weidner_staff_profiles (
  tenant_id,
  user_id,
  role,
  full_name,
  email,
  is_active
)
values (
  '<WEIDNER_TENANT_ID>'::uuid,
  '<AUTH_USER_ID>'::uuid,
  'owner',
  'Cruz Weidner',
  'weidnerlawnscapellc@gmail.com',
  true
)
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  full_name = excluded.full_name,
  email = excluded.email,
  is_active = true,
  updated_at = now();
