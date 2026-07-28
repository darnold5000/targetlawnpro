-- Migration 004: Private storage bucket for Weidner lead photos.
--
-- Hosted Signal Works Pro note: INSERT into storage.buckets may fail with
--   ERROR 42501: must be owner of table buckets
-- If so, create bucket `weidner-lead-photos` (private) in Dashboard, then re-run
-- the policies below (or apply 004b).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'weidner-lead-photos',
  'weidner-lead-photos',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Remove any prior public/anon policies if re-running.
drop policy if exists weidner_lead_photos_storage_select on storage.objects;
drop policy if exists weidner_lead_photos_storage_insert on storage.objects;
drop policy if exists weidner_lead_photos_storage_update on storage.objects;
drop policy if exists weidner_lead_photos_storage_delete on storage.objects;
drop policy if exists weidner_lead_photos_public_read on storage.objects;

-- Authenticated Weidner staff only; path prefix must match their tenant_id.
create policy weidner_lead_photos_storage_select
  on storage.objects for select to authenticated
  using (
    bucket_id = 'weidner-lead-photos'
    and (storage.foldername(name))[1] is not null
    and public.weidner_is_staff((storage.foldername(name))[1]::uuid)
  );

create policy weidner_lead_photos_storage_insert
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'weidner-lead-photos'
    and (storage.foldername(name))[1] is not null
    and public.weidner_is_staff((storage.foldername(name))[1]::uuid)
  );

create policy weidner_lead_photos_storage_update
  on storage.objects for update to authenticated
  using (
    bucket_id = 'weidner-lead-photos'
    and (storage.foldername(name))[1] is not null
    and public.weidner_is_staff((storage.foldername(name))[1]::uuid)
  )
  with check (
    bucket_id = 'weidner-lead-photos'
    and (storage.foldername(name))[1] is not null
    and public.weidner_is_staff((storage.foldername(name))[1]::uuid)
  );

create policy weidner_lead_photos_storage_delete
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'weidner-lead-photos'
    and (storage.foldername(name))[1] is not null
    and public.weidner_is_staff((storage.foldername(name))[1]::uuid)
  );

-- No policies for anon → anonymous clients cannot read/write this bucket.
-- Public form uploads go through service-role API routes only.
-- Service role bypasses storage RLS for signed uploads/URLs.
