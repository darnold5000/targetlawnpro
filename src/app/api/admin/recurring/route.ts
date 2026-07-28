import { NextResponse } from "next/server";
import { resolveAccessState } from "@/lib/auth/access";
import { createRecurringSchema } from "@/lib/ops/schema";
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
    .from(WEIDNER_TABLES.recurringServices)
    .select(
      "id, service_name, frequency, preferred_day, price_cents, active, seasonal_pause, customer_id, start_date, end_date, notes",
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, recurring: data ?? [] });
}

export async function POST(request: Request) {
  const access = await resolveAccessState();
  if (access.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createRecurringSchema.safeParse(await readJsonBody(request));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid recurring service" }, { status: 400 });
  }

  const data = parsed.data;
  const tenantId = getWeidnerTenantId();
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from(WEIDNER_TABLES.recurringServices)
    .insert({
      tenant_id: tenantId,
      customer_id: data.customerId,
      property_id: data.propertyId || null,
      service_name: data.serviceName,
      frequency: data.frequency,
      start_date: data.startDate || null,
      end_date: data.endDate || null,
      preferred_day: data.preferredDay || null,
      price_cents: data.priceCents ?? null,
      active: data.active,
      seasonal_pause: data.seasonalPause,
      notes: data.notes || null,
    })
    .select("id")
    .single();

  if (error || !row) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Could not create recurring service" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, id: row.id });
}
