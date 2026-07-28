import { NextResponse } from "next/server";
import {
  sendAdminLeadAlertEmail,
  sendLeadConfirmationEmail,
} from "@/lib/email/send";
import { contactRequestSchema } from "@/lib/leads/schema";
import { normalizePhoneDigits } from "@/lib/forms/validation";
import { rateLimit } from "@/lib/rate-limit";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantId } from "@/lib/tenant/deployment";
import { readJsonBody } from "@/lib/http/read-json-body";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (!rateLimit(`contact:${ip}`, 12)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await readJsonBody(request);
    const parsed = contactRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please check the form and try again.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;
    if (data.website) {
      return NextResponse.json({ ok: true, id: "ignored" });
    }

    if (!isSupabaseConfigured()) {
      console.info("[contact] demo mode", { email: data.email });
      return NextResponse.json({ ok: true, id: "demo", demo: true });
    }

    const tenantId = getWeidnerTenantId();
    const supabase = createServiceClient();
    const { data: lead, error } = await supabase
      .from(WEIDNER_TABLES.leads)
      .insert({
        tenant_id: tenantId,
        status: "new",
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email.toLowerCase(),
        phone: normalizePhoneDigits(data.phone),
        project_description: data.message,
        service_type: "general-contact",
        consent_contact: data.consentContact,
        source: "contact_form",
        city: siteConfig.serviceArea.primary,
      })
      .select("id")
      .single();

    if (error || !lead) {
      console.error("[contact] insert failed", error);
      return NextResponse.json(
        { ok: false, error: "Could not send message. Please call us." },
        { status: 500 },
      );
    }

    await Promise.allSettled([
      sendLeadConfirmationEmail({
        to: data.email,
        firstName: data.firstName,
        serviceType: "general inquiry",
      }),
      sendAdminLeadAlertEmail({
        leadId: lead.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        serviceType: "general-contact",
      }),
    ]);

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (err) {
    console.error("[contact] unexpected", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 },
    );
  }
}
