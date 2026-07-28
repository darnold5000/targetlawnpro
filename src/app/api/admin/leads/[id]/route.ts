import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveAccessState } from "@/lib/auth/access";
import { LEAD_STATUSES } from "@/lib/leads/schema";
import { createClient } from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantId } from "@/lib/tenant/deployment";
import { readJsonBody } from "@/lib/http/read-json-body";

const patchSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  followUpAt: z.string().datetime().nullable().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const access = await resolveAccessState();
  if (access.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = patchSchema.safeParse(await readJsonBody(request));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid update" }, { status: 400 });
  }

  const tenantId = getWeidnerTenantId();
  const supabase = await createClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (parsed.data.status) updates.status = parsed.data.status;
  if (parsed.data.followUpAt !== undefined) {
    updates.follow_up_at = parsed.data.followUpAt;
  }

  const { error } = await supabase
    .from(WEIDNER_TABLES.leads)
    .update(updates)
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
