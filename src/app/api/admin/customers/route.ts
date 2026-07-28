import { NextResponse } from "next/server";
import { resolveAccessState } from "@/lib/auth/access";
import { createClient } from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantId } from "@/lib/tenant/deployment";

export async function GET() {
  const access = await resolveAccessState();
  if (access.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = getWeidnerTenantId();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(WEIDNER_TABLES.customers)
    .select("id, first_name, last_name, email, phone, preferred_contact, created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, customers: data ?? [] });
}
