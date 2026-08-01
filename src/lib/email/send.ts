import { Resend } from "resend";
import { siteConfig } from "@/config/site";
import { escapeHtml } from "@/lib/email/html";

function getResend() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

function replyToAddress(): string | undefined {
  const business = siteConfig.email?.trim();
  if (business) return business;
  return process.env.ADMIN_NOTIFY_EMAIL?.trim() || undefined;
}

function contactLinesHtml(): string {
  const lines = [
    `Call or text: <a href="${siteConfig.phoneHref}">${siteConfig.phoneDisplay}</a>`,
  ];
  if (siteConfig.email) {
    lines.push(
      `Email: <a href="mailto:${siteConfig.email}">${escapeHtml(siteConfig.email)}</a>`,
    );
  }
  return lines.join("<br/>");
}

function fromAddress() {
  const email =
    process.env.EMAIL_FROM?.trim() ||
    process.env.WEIDNER_EMAIL_FROM?.trim() ||
    "onboarding@resend.dev";
  const name =
    process.env.EMAIL_FROM_NAME?.trim() || siteConfig.name;
  return `${name} <${email}>`;
}

export async function sendLeadConfirmationEmail(input: {
  to: string;
  firstName: string;
  serviceType?: string | null;
}) {
  const resend = getResend();
  if (!resend) {
    console.info("[email] RESEND_API_KEY missing — skipped customer confirmation");
    return { ok: false as const, skipped: true };
  }

  const subject = `We received your estimate request — ${siteConfig.name}`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1c241c">
      <p>Hi ${escapeHtml(input.firstName)},</p>
      <p>Thanks for contacting <strong>${escapeHtml(siteConfig.name)}</strong>. We received your estimate request${
        input.serviceType ? ` for <strong>${escapeHtml(input.serviceType)}</strong>` : ""
      } and will follow up soon.</p>
      <p>${escapeHtml(siteConfig.responseTime)}</p>
      <p>${contactLinesHtml()}</p>
      <p style="color:#5a6358;font-size:13px">${escapeHtml(siteConfig.serviceArea.summary)}</p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: input.to,
    subject,
    html,
    ...(replyToAddress() ? { replyTo: replyToAddress() } : {}),
  });

  if (error) {
    console.error("[email] customer confirmation failed", error);
    return { ok: false as const, skipped: false };
  }
  return { ok: true as const, skipped: false };
}

export async function sendAdminLeadAlertEmail(input: {
  leadId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceType?: string | null;
  city?: string | null;
  outsideServiceArea?: boolean;
}) {
  const resend = getResend();
  const notify =
    process.env.ADMIN_NOTIFY_EMAIL?.trim() || siteConfig.email;
  if (!resend || !notify) {
    console.info("[email] RESEND_API_KEY or ADMIN_NOTIFY_EMAIL missing — skipped admin alert");
    return { ok: false as const, skipped: true };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.siteUrl;
  const subject = `New lead: ${input.firstName} ${input.lastName}`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1c241c">
      <p><strong>New estimate request</strong></p>
      <ul>
        <li>${escapeHtml(input.firstName)} ${escapeHtml(input.lastName)}</li>
        <li>${escapeHtml(input.email)}</li>
        <li>${escapeHtml(input.phone)}</li>
        <li>Service: ${escapeHtml(input.serviceType ?? "—")}</li>
        <li>City: ${escapeHtml(input.city ?? "—")}</li>
        ${input.outsideServiceArea ? "<li><strong>Flagged outside usual service area</strong></li>" : ""}
      </ul>
      <p><a href="${siteUrl}/admin/leads/${input.leadId}">Open in admin</a></p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: notify,
    subject,
    html,
  });

  if (error) {
    console.error("[email] admin alert failed", error);
    return { ok: false as const, skipped: false };
  }
  return { ok: true as const, skipped: false };
}
