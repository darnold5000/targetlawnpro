import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import {
  createServiceClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { LEAD_PHOTO_BUCKET } from "@/lib/supabase/tables";
import { getWeidnerTenantId } from "@/lib/tenant/deployment";

export const runtime = "nodejs";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`upload:${ip}`, 30)) {
    return NextResponse.json({ ok: false, error: "Too many uploads" }, { status: 429 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      demo: true,
      path: `demo/${Date.now()}.jpg`,
    });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "File required" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { ok: false, error: "Only JPEG, PNG, WebP, or HEIC images are allowed" },
      { status: 400 },
    );
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { ok: false, error: "Each photo must be under 10MB" },
      { status: 400 },
    );
  }

  const tenantId = getWeidnerTenantId();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${tenantId}/leads/${crypto.randomUUID()}.${ext}`;
  const supabase = createServiceClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(LEAD_PHOTO_BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[upload]", error);
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    path,
    fileName: file.name,
    contentType: file.type,
    sizeBytes: file.size,
  });
}
