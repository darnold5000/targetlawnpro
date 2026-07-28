-- Migration 002: Weidner Lawnscape domain schema (tenant-scoped, weidner_ prefix).
-- All tables include tenant_id → public.tenants(id). No unprefixed public objects.

create table if not exists public.weidner_staff_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'staff', 'content_editor')),
  full_name text not null,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create index if not exists weidner_staff_profiles_tenant_idx
  on public.weidner_staff_profiles (tenant_id);
create index if not exists weidner_staff_profiles_user_idx
  on public.weidner_staff_profiles (user_id);

create table if not exists public.weidner_leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  status text not null default 'new' check (status in (
    'new', 'contacted', 'estimate_scheduled', 'estimate_in_progress',
    'estimate_sent', 'approved', 'declined', 'converted_to_job', 'lost', 'archived'
  )),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  preferred_contact text
    check (
      preferred_contact is null
      or preferred_contact in ('phone', 'text', 'email')
    ),
  address text,
  city text,
  zip text,
  service_type text,
  project_description text,
  timeline text,
  service_frequency text
    check (
      service_frequency is null
      or service_frequency in ('one_time', 'recurring')
    ),
  property_type text,
  budget_range text,
  referral_source text,
  preferred_estimate_date date,
  preferred_time_window text,
  estimate_type text
    check (
      estimate_type is null
      or estimate_type in ('onsite', 'virtual')
    ),
  consent_contact boolean not null default false,
  consent_sms boolean not null default false,
  outside_service_area boolean not null default false,
  source text not null default 'estimate_form',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  landing_page text,
  assigned_staff_id uuid references public.weidner_staff_profiles(id) on delete set null,
  follow_up_at timestamptz,
  customer_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists weidner_leads_tenant_idx on public.weidner_leads (tenant_id);
create index if not exists weidner_leads_status_idx on public.weidner_leads (tenant_id, status);
create index if not exists weidner_leads_created_idx on public.weidner_leads (tenant_id, created_at desc);
create index if not exists weidner_leads_email_idx on public.weidner_leads (tenant_id, lower(email));

create table if not exists public.weidner_lead_photos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  lead_id uuid not null references public.weidner_leads(id) on delete cascade,
  storage_path text not null,
  file_name text,
  content_type text,
  size_bytes integer,
  created_at timestamptz not null default now()
);

create index if not exists weidner_lead_photos_lead_idx on public.weidner_lead_photos (lead_id);
create index if not exists weidner_lead_photos_tenant_idx on public.weidner_lead_photos (tenant_id);

create table if not exists public.weidner_lead_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  lead_id uuid not null references public.weidner_leads(id) on delete cascade,
  author_user_id uuid references auth.users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists weidner_lead_notes_lead_idx on public.weidner_lead_notes (lead_id, created_at desc);
create index if not exists weidner_lead_notes_tenant_idx on public.weidner_lead_notes (tenant_id);

create table if not exists public.weidner_customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  preferred_contact text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists weidner_customers_tenant_idx on public.weidner_customers (tenant_id);

alter table public.weidner_leads
  drop constraint if exists weidner_leads_customer_id_fkey;
alter table public.weidner_leads
  add constraint weidner_leads_customer_id_fkey
  foreign key (customer_id) references public.weidner_customers(id) on delete set null;

create table if not exists public.weidner_customer_properties (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid not null references public.weidner_customers(id) on delete cascade,
  address text not null,
  city text,
  zip text,
  gate_code text,
  pet_warnings text,
  irrigation_notes text,
  access_instructions text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists weidner_customer_properties_customer_idx
  on public.weidner_customer_properties (customer_id);
create index if not exists weidner_customer_properties_tenant_idx
  on public.weidner_customer_properties (tenant_id);

create table if not exists public.weidner_estimates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid references public.weidner_customers(id) on delete set null,
  lead_id uuid references public.weidner_leads(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'approved', 'declined', 'expired')),
  subtotal_cents integer not null default 0,
  discount_cents integer not null default 0,
  tax_cents integer not null default 0,
  total_cents integer not null default 0,
  notes text,
  terms text,
  expires_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists weidner_estimates_tenant_idx on public.weidner_estimates (tenant_id, status);

create table if not exists public.weidner_estimate_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  estimate_id uuid not null references public.weidner_estimates(id) on delete cascade,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit text,
  rate_cents integer not null default 0,
  sort_order integer not null default 0
);

create index if not exists weidner_estimate_items_estimate_idx on public.weidner_estimate_items (estimate_id);
create index if not exists weidner_estimate_items_tenant_idx on public.weidner_estimate_items (tenant_id);

create table if not exists public.weidner_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid references public.weidner_customers(id) on delete set null,
  estimate_id uuid references public.weidner_estimates(id) on delete set null,
  lead_id uuid references public.weidner_leads(id) on delete set null,
  service_type text,
  status text not null default 'unscheduled' check (status in (
    'unscheduled', 'scheduled', 'confirmed', 'in_progress', 'delayed', 'completed', 'canceled'
  )),
  scheduled_date date,
  arrival_window text,
  instructions text,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists weidner_jobs_tenant_idx on public.weidner_jobs (tenant_id, status);
create index if not exists weidner_jobs_scheduled_idx on public.weidner_jobs (tenant_id, scheduled_date);

create table if not exists public.weidner_recurring_services (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid not null references public.weidner_customers(id) on delete cascade,
  property_id uuid references public.weidner_customer_properties(id) on delete set null,
  service_name text not null,
  frequency text not null,
  start_date date,
  end_date date,
  preferred_day text,
  price_cents integer,
  active boolean not null default true,
  seasonal_pause boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists weidner_recurring_tenant_idx
  on public.weidner_recurring_services (tenant_id, active);

create table if not exists public.weidner_activity_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  actor_user_id uuid references auth.users(id) on delete set null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists weidner_activity_log_entity_idx
  on public.weidner_activity_log (tenant_id, entity_type, entity_id, created_at desc);

-- Prevent tenant_id reassignment after insert (cross-tenant move).
create or replace function public.weidner_protect_tenant_id()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and new.tenant_id is distinct from old.tenant_id then
    raise exception 'weidner: tenant_id is immutable';
  end if;
  return new;
end;
$$;

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
    execute format('drop trigger if exists %I on public.%I', t || '_protect_tenant', t);
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.weidner_protect_tenant_id()',
      t || '_protect_tenant', t
    );
  end loop;
end $$;
