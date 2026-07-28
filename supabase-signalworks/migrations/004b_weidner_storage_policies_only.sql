-- Migration 004b: Storage policies only (when bucket INSERT requires Dashboard).
-- Create private bucket `weidner-lead-photos` in Supabase Dashboard first, then run this.

drop policy if exists weidner_lead_photos_storage_select on storage.objects;
drop policy if exists weidner_lead_photos_storage_insert on storage.objects;
drop policy if exists weidner_lead_photos_storage_update on storage.objects;
drop policy if exists weidner_lead_photos_storage_delete on storage.objects;
drop policy if exists weidner_lead_photos_public_read on storage.objects;

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
