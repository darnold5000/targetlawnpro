import { NextResponse } from "next/server";
import { resolveAccessState } from "@/lib/auth/access";
import {
  createServiceClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { LEAD_PHOTO_BUCKET, WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantId } from "@/lib/tenant/deployment";

type Params = { params: Promise<{ id: string }> };

/** Return short-lived signed URLs for lead photos (staff only). */
export async function GET(_request: Request, { params }: Params) {
  const access = await resolveAccessState();
  if (access.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, photos: [] });
  }

  const { id } = await params;
  const tenantId = getWeidnerTenantId();
  const supabase = createServiceClient();

  const { data: photos, error } = await supabase
    .from(WEIDNER_TABLES.leadPhotos)
    .select("id, storage_path, file_name, content_type")
    .eq("tenant_id", tenantId)
    .eq("lead_id", id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const withUrls = await Promise.all(
    (photos ?? []).map(async (photo) => {
      if (photo.storage_path.startsWith("demo/")) {
        return { ...photo, url: null as string | null };
      }
      const { data } = await supabase.storage
        .from(LEAD_PHOTO_BUCKET)
        .createSignedUrl(photo.storage_path, 60 * 30);
      return { ...photo, url: data?.signedUrl ?? null };
    }),
  );

  return NextResponse.json({ ok: true, photos: withUrls });
}
