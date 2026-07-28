import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveAccessState } from "@/lib/auth/access";
import { createClient } from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantId } from "@/lib/tenant/deployment";
import { readJsonBody } from "@/lib/http/read-json-body";

const noteSchema = z.object({
  body: z.string().trim().min(1).max(4000),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const access = await resolveAccessState();
  if (access.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = noteSchema.safeParse(await readJsonBody(request));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Note is required" }, { status: 400 });
  }

  const tenantId = getWeidnerTenantId();
  const supabase = await createClient();
  const { error } = await supabase.from(WEIDNER_TABLES.leadNotes).insert({
    tenant_id: tenantId,
    lead_id: id,
    author_user_id: access.profile.userId,
    body: parsed.data.body,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
