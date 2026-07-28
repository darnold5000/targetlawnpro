import { NextResponse } from "next/server";
import { resolveAccessState } from "@/lib/auth/access";
import { createClient } from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantId } from "@/lib/tenant/deployment";

type Params = { params: Promise<{ id: string }> };

/** Convert a lead into a customer (+ property when address present). */
export async function POST(_request: Request, { params }: Params) {
  const access = await resolveAccessState();
  if (access.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const tenantId = getWeidnerTenantId();
  const supabase = await createClient();

  const { data: lead, error: leadError } = await supabase
    .from(WEIDNER_TABLES.leads)
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (leadError || !lead) {
    return NextResponse.json({ ok: false, error: "Lead not found" }, { status: 404 });
  }

  if (lead.customer_id) {
    return NextResponse.json({
      ok: true,
      customerId: lead.customer_id,
      alreadyConverted: true,
    });
  }

  const { data: customer, error: customerError } = await supabase
    .from(WEIDNER_TABLES.customers)
    .insert({
      tenant_id: tenantId,
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      phone: lead.phone,
      preferred_contact: lead.preferred_contact,
      notes: lead.project_description,
    })
    .select("id")
    .single();

  if (customerError || !customer) {
    return NextResponse.json(
      { ok: false, error: customerError?.message || "Could not create customer" },
      { status: 500 },
    );
  }

  let propertyId: string | null = null;
  if (lead.address) {
    const { data: property } = await supabase
      .from(WEIDNER_TABLES.customerProperties)
      .insert({
        tenant_id: tenantId,
        customer_id: customer.id,
        address: lead.address,
        city: lead.city,
        zip: lead.zip,
        notes: lead.service_type
          ? `Initial service interest: ${lead.service_type}`
          : null,
      })
      .select("id")
      .single();
    propertyId = property?.id ?? null;
  }

  await supabase
    .from(WEIDNER_TABLES.leads)
    .update({
      customer_id: customer.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", tenantId);

  await supabase.from(WEIDNER_TABLES.activityLog).insert({
    tenant_id: tenantId,
    entity_type: "lead",
    entity_id: id,
    action: "converted_to_customer",
    actor_user_id: access.profile.userId,
    meta: { customer_id: customer.id, property_id: propertyId },
  });

  return NextResponse.json({
    ok: true,
    customerId: customer.id,
    propertyId,
  });
}
