import { NextResponse } from "next/server";
import {
  sendAdminLeadAlertEmail,
  sendLeadConfirmationEmail,
} from "@/lib/email/send";
import { estimateRequestSchema } from "@/lib/leads/schema";
import { normalizePhoneDigits } from "@/lib/forms/validation";
import { rateLimit } from "@/lib/rate-limit";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantId } from "@/lib/tenant/deployment";
import { readJsonBody } from "@/lib/http/read-json-body";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";

function looksOutsideServiceArea(city: string, zip: string): boolean {
  const c = city.trim().toLowerCase();
  if (!c) return true;
  if (c.includes("zionsville")) return false;
  // ZIP list not published on source site — flag non-Zionsville cities for review.
  void zip;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(`estimate:${ip}`)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await readJsonBody(request);
    const parsed = estimateRequestSchema.safeParse(body);
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
      console.info("[estimate] demo mode — Supabase not configured", {
        email: data.email,
        serviceType: data.serviceType,
      });
      return NextResponse.json({
        ok: true,
        id: "demo",
        demo: true,
        message:
          "Saved in demo mode (database not configured). Configure Supabase to persist leads.",
      });
    }

    const tenantId = getWeidnerTenantId();
    const supabase = createServiceClient();
    const outside =
      data.outsideServiceArea ??
      looksOutsideServiceArea(data.city, data.zip);

    const { data: lead, error } = await supabase
      .from(WEIDNER_TABLES.leads)
      .insert({
        tenant_id: tenantId,
        status: "new",
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email.toLowerCase(),
        phone: normalizePhoneDigits(data.phone),
        preferred_contact: data.preferredContact ?? null,
        address: data.address,
        city: data.city,
        zip: data.zip,
        service_type: data.serviceType,
        project_description: data.projectDescription ?? null,
        timeline: data.timeline ?? null,
        service_frequency: data.serviceFrequency ?? null,
        property_type: data.propertyType ?? null,
        budget_range: data.budgetRange ?? null,
        referral_source: data.referralSource ?? null,
        preferred_estimate_date: data.preferredEstimateDate || null,
        preferred_time_window: data.preferredTimeWindow ?? null,
        estimate_type: data.estimateType ?? null,
        consent_contact: data.consentContact,
        consent_sms: Boolean(data.consentSms),
        outside_service_area: outside,
        source: "estimate_form",
        utm_source: data.utmSource ?? null,
        utm_medium: data.utmMedium ?? null,
        utm_campaign: data.utmCampaign ?? null,
        utm_term: data.utmTerm ?? null,
        utm_content: data.utmContent ?? null,
        referrer: data.referrer ?? null,
        landing_page: data.landingPage ?? null,
      })
      .select("id")
      .single();

    if (error || !lead) {
      console.error("[estimate] insert failed", error);
      return NextResponse.json(
        { ok: false, error: "Could not save your request. Please call us." },
        { status: 500 },
      );
    }

    if (data.photoPaths?.length) {
      const rows = data.photoPaths.map((photo) => ({
        tenant_id: tenantId,
        lead_id: lead.id,
        storage_path: photo.path,
        file_name: photo.fileName ?? null,
        content_type: photo.contentType ?? null,
        size_bytes: photo.sizeBytes ?? null,
      }));
      const { error: photoError } = await supabase
        .from(WEIDNER_TABLES.leadPhotos)
        .insert(rows);
      if (photoError) {
        console.error("[estimate] photo rows failed", photoError);
      }
    }

    await Promise.allSettled([
      sendLeadConfirmationEmail({
        to: data.email,
        firstName: data.firstName,
        serviceType: data.serviceType,
      }),
      sendAdminLeadAlertEmail({
        leadId: lead.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        serviceType: data.serviceType,
        city: data.city,
        outsideServiceArea: outside,
      }),
    ]);

    return NextResponse.json({
      ok: true,
      id: lead.id,
      message: `Thanks — ${siteConfig.name} will be in touch soon.`,
    });
  } catch (err) {
    console.error("[estimate] unexpected", err);
    return NextResponse.json(
      {
        ok: false,
        error: `Something went wrong. Please call ${siteConfig.phoneDisplay}.`,
      },
      { status: 500 },
    );
  }
}
