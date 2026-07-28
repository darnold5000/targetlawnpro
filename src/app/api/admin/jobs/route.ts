import { NextResponse } from "next/server";
import { resolveAccessState } from "@/lib/auth/access";
import { createJobSchema } from "@/lib/ops/schema";
import { createClient } from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantId } from "@/lib/tenant/deployment";
import { readJsonBody } from "@/lib/http/read-json-body";

export async function GET() {
  const access = await resolveAccessState();
  if (access.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = getWeidnerTenantId();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(WEIDNER_TABLES.jobs)
    .select(
      "id, status, service_type, scheduled_date, arrival_window, customer_id, estimate_id, lead_id, created_at",
    )
    .eq("tenant_id", tenantId)
    .order("scheduled_date", { ascending: true, nullsFirst: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, jobs: data ?? [] });
}

export async function POST(request: Request) {
  const access = await resolveAccessState();
  if (access.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createJobSchema.safeParse(await readJsonBody(request));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid job" }, { status: 400 });
  }

  const data = parsed.data;
  const tenantId = getWeidnerTenantId();
  const supabase = await createClient();

  const { data: job, error } = await supabase
    .from(WEIDNER_TABLES.jobs)
    .insert({
      tenant_id: tenantId,
      customer_id: data.customerId || null,
      estimate_id: data.estimateId || null,
      lead_id: data.leadId || null,
      service_type: data.serviceType || null,
      status: data.status,
      scheduled_date: data.scheduledDate || null,
      arrival_window: data.arrivalWindow || null,
      instructions: data.instructions || null,
      internal_notes: data.internalNotes || null,
    })
    .select("id")
    .single();

  if (error || !job) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Could not create job" },
      { status: 500 },
    );
  }

  if (data.leadId) {
    await supabase
      .from(WEIDNER_TABLES.leads)
      .update({
        status: "converted_to_job",
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.leadId)
      .eq("tenant_id", tenantId);
  }

  if (data.estimateId) {
    await supabase
      .from(WEIDNER_TABLES.estimates)
      .update({ status: "approved", updated_at: new Date().toISOString() })
      .eq("id", data.estimateId)
      .eq("tenant_id", tenantId);
  }

  await supabase.from(WEIDNER_TABLES.activityLog).insert({
    tenant_id: tenantId,
    entity_type: "job",
    entity_id: job.id,
    action: "created",
    actor_user_id: access.profile.userId,
    meta: { lead_id: data.leadId, estimate_id: data.estimateId },
  });

  return NextResponse.json({ ok: true, id: job.id });
}
