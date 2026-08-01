-- Update tenant display name for Target Lawn Pro rebrand (slug unchanged).
update public.tenants
set
  display_name = 'Target Lawn Pro',
  updated_at = now()
where slug = 'weidner-lawnscape'
  and display_name is distinct from 'Target Lawn Pro';
