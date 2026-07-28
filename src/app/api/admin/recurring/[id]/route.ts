import { NextResponse } from "next/server";
import { resolveAccessState } from "@/lib/auth/access";
import { updateRecurringSchema } from "@/lib/ops/schema";
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
  const parsed = updateRecurringSchema.safeParse(await readJsonBody(request));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid update" }, { status: 400 });
  }

  const data = parsed.data;
  const tenantId = getWeidnerTenantId();
  const supabase = await createClient();
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (data.customerId !== undefined) updates.customer_id = data.customerId;
  if (data.propertyId !== undefined) updates.property_id = data.propertyId;
  if (data.serviceName !== undefined) updates.service_name = data.serviceName;
  if (data.frequency !== undefined) updates.frequency = data.frequency;
  if (data.startDate !== undefined) updates.start_date = data.startDate;
  if (data.endDate !== undefined) updates.end_date = data.endDate;
  if (data.preferredDay !== undefined) updates.preferred_day = data.preferredDay;
  if (data.priceCents !== undefined) updates.price_cents = data.priceCents;
  if (data.active !== undefined) updates.active = data.active;
  if (data.seasonalPause !== undefined) updates.seasonal_pause = data.seasonalPause;
  if (data.notes !== undefined) updates.notes = data.notes;

  const { error } = await supabase
    .from(WEIDNER_TABLES.recurringServices)
    .update(updates)
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
