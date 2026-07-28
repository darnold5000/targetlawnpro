import { NextResponse } from "next/server";
import { resolveAccessState } from "@/lib/auth/access";
import { updateJobSchema } from "@/lib/ops/schema";
import { createClient } from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantId } from "@/lib/tenant/deployment";
import { readJsonBody } from "@/lib/http/read-json-body";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const access = await resolveAccessState();
  if (access.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = updateJobSchema.safeParse(await readJsonBody(request));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid update" }, { status: 400 });
  }

  const data = parsed.data;
  const tenantId = getWeidnerTenantId();
  const supabase = await createClient();

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (data.status !== undefined) updates.status = data.status;
  if (data.serviceType !== undefined) updates.service_type = data.serviceType;
  if (data.scheduledDate !== undefined) updates.scheduled_date = data.scheduledDate;
  if (data.arrivalWindow !== undefined) updates.arrival_window = data.arrivalWindow;
  if (data.instructions !== undefined) updates.instructions = data.instructions;
  if (data.internalNotes !== undefined) updates.internal_notes = data.internalNotes;
  if (data.customerId !== undefined) updates.customer_id = data.customerId;
  if (data.estimateId !== undefined) updates.estimate_id = data.estimateId;
  if (data.leadId !== undefined) updates.lead_id = data.leadId;

  const { error } = await supabase
    .from(WEIDNER_TABLES.jobs)
    .update(updates)
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
