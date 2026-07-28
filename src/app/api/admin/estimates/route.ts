import { NextResponse } from "next/server";
import { resolveAccessState } from "@/lib/auth/access";
import { createEstimateSchema } from "@/lib/ops/schema";
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
    .from(WEIDNER_TABLES.estimates)
    .select(
      "id, status, total_cents, subtotal_cents, customer_id, lead_id, created_at, expires_at, notes",
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, estimates: data ?? [] });
}

export async function POST(request: Request) {
  const access = await resolveAccessState();
  if (access.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createEstimateSchema.safeParse(await readJsonBody(request));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid estimate", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const tenantId = getWeidnerTenantId();
  const supabase = await createClient();

  const subtotal = data.items.reduce(
    (sum, item) => sum + Math.round(item.quantity * item.rateCents),
    0,
  );
  const total = Math.max(0, subtotal - data.discountCents + data.taxCents);

  const { data: estimate, error } = await supabase
    .from(WEIDNER_TABLES.estimates)
    .insert({
      tenant_id: tenantId,
      customer_id: data.customerId || null,
      lead_id: data.leadId || null,
      status: data.status,
      subtotal_cents: subtotal,
      discount_cents: data.discountCents,
      tax_cents: data.taxCents,
      total_cents: total,
      notes: data.notes || null,
      terms: data.terms || null,
      expires_at: data.expiresAt || null,
    })
    .select("id")
    .single();

  if (error || !estimate) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Could not create estimate" },
      { status: 500 },
    );
  }

  const items = data.items.map((item, index) => ({
    tenant_id: tenantId,
    estimate_id: estimate.id,
    description: item.description,
    quantity: item.quantity,
    unit: item.unit || null,
    rate_cents: item.rateCents,
    sort_order: index,
  }));

  const { error: itemsError } = await supabase
    .from(WEIDNER_TABLES.estimateItems)
    .insert(items);

  if (itemsError) {
    return NextResponse.json(
      { ok: false, error: itemsError.message },
      { status: 500 },
    );
  }

  if (data.leadId) {
    await supabase
      .from(WEIDNER_TABLES.leads)
      .update({
        status: data.status === "sent" ? "estimate_sent" : "estimate_in_progress",
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.leadId)
      .eq("tenant_id", tenantId);
  }

  await supabase.from(WEIDNER_TABLES.activityLog).insert({
    tenant_id: tenantId,
    entity_type: "estimate",
    entity_id: estimate.id,
    action: "created",
    actor_user_id: access.profile.userId,
    meta: { total_cents: total, lead_id: data.leadId },
  });

  return NextResponse.json({ ok: true, id: estimate.id });
}
