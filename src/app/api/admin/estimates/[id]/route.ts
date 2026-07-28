import { NextResponse } from "next/server";
import { resolveAccessState } from "@/lib/auth/access";
import { updateEstimateSchema } from "@/lib/ops/schema";
import { createClient } from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantId } from "@/lib/tenant/deployment";
import { readJsonBody } from "@/lib/http/read-json-body";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const access = await resolveAccessState();
  if (access.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const tenantId = getWeidnerTenantId();
  const supabase = await createClient();

  const { data: estimate, error } = await supabase
    .from(WEIDNER_TABLES.estimates)
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (error || !estimate) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  const { data: items } = await supabase
    .from(WEIDNER_TABLES.estimateItems)
    .select("*")
    .eq("estimate_id", id)
    .order("sort_order", { ascending: true });

  return NextResponse.json({ ok: true, estimate, items: items ?? [] });
}

export async function PATCH(request: Request, { params }: Params) {
  const access = await resolveAccessState();
  if (access.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = updateEstimateSchema.safeParse(await readJsonBody(request));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid update" }, { status: 400 });
  }

  const tenantId = getWeidnerTenantId();
  const supabase = await createClient();
  const data = parsed.data;
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (data.status) updates.status = data.status;
  if (data.notes !== undefined) updates.notes = data.notes;
  if (data.terms !== undefined) updates.terms = data.terms;
  if (data.expiresAt !== undefined) updates.expires_at = data.expiresAt;
  if (data.discountCents !== undefined) updates.discount_cents = data.discountCents;
  if (data.taxCents !== undefined) updates.tax_cents = data.taxCents;

  if (data.items) {
    const subtotal = data.items.reduce(
      (sum, item) => sum + Math.round(item.quantity * item.rateCents),
      0,
    );
    const discount = data.discountCents ?? 0;
    const tax = data.taxCents ?? 0;
    updates.subtotal_cents = subtotal;
    updates.total_cents = Math.max(0, subtotal - discount + tax);

    await supabase
      .from(WEIDNER_TABLES.estimateItems)
      .delete()
      .eq("estimate_id", id)
      .eq("tenant_id", tenantId);

    await supabase.from(WEIDNER_TABLES.estimateItems).insert(
      data.items.map((item, index) => ({
        tenant_id: tenantId,
        estimate_id: id,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit || null,
        rate_cents: item.rateCents,
        sort_order: index,
      })),
    );
  }

  const { error } = await supabase
    .from(WEIDNER_TABLES.estimates)
    .update(updates)
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (data.status === "approved" || data.status === "sent" || data.status === "declined") {
    const { data: estimate } = await supabase
      .from(WEIDNER_TABLES.estimates)
      .select("lead_id")
      .eq("id", id)
      .maybeSingle();

    if (estimate?.lead_id) {
      const leadStatus =
        data.status === "approved"
          ? "approved"
          : data.status === "declined"
            ? "declined"
            : "estimate_sent";
      await supabase
        .from(WEIDNER_TABLES.leads)
        .update({ status: leadStatus, updated_at: new Date().toISOString() })
        .eq("id", estimate.lead_id)
        .eq("tenant_id", tenantId);
    }
  }

  return NextResponse.json({ ok: true });
}
