import {
  createServiceClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { LEAD_PHOTO_BUCKET } from "@/lib/supabase/tables";

export type SignedLeadPhoto = {
  id: string;
  fileName: string | null;
  storagePath: string;
  url: string | null;
};

export async function getSignedLeadPhotos(
  tenantId: string,
  photos: { id: string; storage_path: string; file_name: string | null }[],
): Promise<SignedLeadPhoto[]> {
  if (!isSupabaseConfigured() || photos.length === 0) {
    return photos.map((p) => ({
      id: p.id,
      fileName: p.file_name,
      storagePath: p.storage_path,
      url: null,
    }));
  }

  const supabase = createServiceClient();
  return Promise.all(
    photos.map(async (photo) => {
      if (
        !photo.storage_path.startsWith(tenantId) &&
        !photo.storage_path.startsWith("demo/")
      ) {
        return {
          id: photo.id,
          fileName: photo.file_name,
          storagePath: photo.storage_path,
          url: null,
        };
      }
      if (photo.storage_path.startsWith("demo/")) {
        return {
          id: photo.id,
          fileName: photo.file_name,
          storagePath: photo.storage_path,
          url: null,
        };
      }
      const { data } = await supabase.storage
        .from(LEAD_PHOTO_BUCKET)
        .createSignedUrl(photo.storage_path, 60 * 30);
      return {
        id: photo.id,
        fileName: photo.file_name,
        storagePath: photo.storage_path,
        url: data?.signedUrl ?? null,
      };
    }),
  );
}
