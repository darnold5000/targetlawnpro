import Link from "next/link";
import { notFound } from "next/navigation";
import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantIdOrNull } from "@/lib/tenant/deployment";
import { LeadActions } from "@/components/admin/lead-actions";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/leads/schema";
import { getSignedLeadPhotos } from "@/lib/admin/signed-photos";

type Props = { params: Promise<{ id: string }> };

export default async function AdminLeadDetailPage({ params }: Props) {
  const { id } = await params;
  if (!isSupabaseConfigured() || !getWeidnerTenantIdOrNull()) notFound();

  const tenantId = getWeidnerTenantIdOrNull()!;
  const supabase = await createClient();
  const { data: lead } = await supabase
    .from(WEIDNER_TABLES.leads)
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (!lead) notFound();

  const [{ data: notes }, { data: photos }, { data: estimates }, { data: jobs }] =
    await Promise.all([
      supabase
        .from(WEIDNER_TABLES.leadNotes)
        .select("id, body, created_at")
        .eq("lead_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from(WEIDNER_TABLES.leadPhotos)
        .select("id, storage_path, file_name")
        .eq("lead_id", id),
      supabase
        .from(WEIDNER_TABLES.estimates)
        .select("id, status, total_cents, created_at")
        .eq("lead_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from(WEIDNER_TABLES.jobs)
        .select("id, status, scheduled_date, service_type")
        .eq("lead_id", id)
        .order("created_at", { ascending: false }),
    ]);

  const signedPhotos = await getSignedLeadPhotos(tenantId, photos ?? []);

  return (
    <div>
      <Link href="/admin/leads" className="text-sm text-muted hover:text-evergreen">
        ← Leads
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-evergreen-deep">
            {lead.first_name} {lead.last_name}
          </h1>
          <p className="mt-1 text-muted">
            {LEAD_STATUS_LABELS[lead.status as LeadStatus] ?? lead.status}
            {lead.outside_service_area ? " · Outside usual service area" : ""}
            {lead.customer_id ? (
              <>
                {" · "}
                <Link
                  href={`/admin/customers/${lead.customer_id}`}
                  className="text-leaf underline"
                >
                  View customer
                </Link>
              </>
            ) : null}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`tel:${lead.phone}`} className="rounded-md border border-border px-3 py-2 text-sm">
            Call
          </a>
          <a href={`sms:${lead.phone}`} className="rounded-md border border-border px-3 py-2 text-sm">
            Text
          </a>
          <a href={`mailto:${lead.email}`} className="rounded-md border border-border px-3 py-2 text-sm">
            Email
          </a>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-border bg-surface p-5 text-sm">
          <Row label="Email" value={lead.email} />
          <Row label="Phone" value={lead.phone} />
          <Row label="Preferred contact" value={lead.preferred_contact} />
          <Row
            label="Address"
            value={[lead.address, lead.city, lead.zip].filter(Boolean).join(", ")}
          />
          <Row label="Service" value={lead.service_type} />
          <Row label="Frequency" value={lead.service_frequency} />
          <Row label="Property type" value={lead.property_type} />
          <Row label="Timeline" value={lead.timeline} />
          <Row label="Budget" value={lead.budget_range} />
          <Row label="Referral" value={lead.referral_source} />
          <Row label="Estimate date" value={lead.preferred_estimate_date} />
          <Row label="Time window" value={lead.preferred_time_window} />
          <Row label="Estimate type" value={lead.estimate_type} />
          <Row label="Source" value={lead.source} />
          <Row
            label="UTM"
            value={[lead.utm_source, lead.utm_medium, lead.utm_campaign]
              .filter(Boolean)
              .join(" / ")}
          />
          <div>
            <p className="font-medium text-evergreen">Description</p>
            <p className="mt-1 whitespace-pre-wrap text-muted">
              {lead.project_description || "—"}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <LeadActions
            leadId={lead.id}
            status={lead.status}
            customerId={lead.customer_id}
            serviceType={lead.service_type}
          />

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-semibold text-evergreen">Photos</h2>
            {!signedPhotos.length ? (
              <p className="mt-2 text-sm text-muted">No photos uploaded.</p>
            ) : (
              <ul className="mt-3 grid grid-cols-2 gap-3">
                {signedPhotos.map((photo) => (
                  <li
                    key={photo.id}
                    className="overflow-hidden rounded-md border border-border"
                  >
                    {photo.url ? (
                      <a href={photo.url} target="_blank" rel="noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.url}
                          alt={photo.fileName ?? "Lead photo"}
                          className="aspect-square w-full object-cover"
                        />
                      </a>
                    ) : (
                      <p className="p-3 text-xs text-muted">
                        {photo.fileName ?? photo.storagePath}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-semibold text-evergreen">Linked estimates</h2>
            {!estimates?.length ? (
              <p className="mt-2 text-sm text-muted">None yet.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {estimates.map((est) => (
                  <li key={est.id}>
                    <Link
                      href={`/admin/estimates/${est.id}`}
                      className="font-medium text-leaf underline"
                    >
                      {est.status} — ${(est.total_cents / 100).toFixed(2)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-semibold text-evergreen">Linked jobs</h2>
            {!jobs?.length ? (
              <p className="mt-2 text-sm text-muted">None yet.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {jobs.map((job) => (
                  <li key={job.id}>
                    <Link
                      href={`/admin/jobs/${job.id}`}
                      className="font-medium text-leaf underline"
                    >
                      {job.status}
                      {job.scheduled_date ? ` · ${job.scheduled_date}` : ""}
                      {job.service_type ? ` · ${job.service_type}` : ""}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-semibold text-evergreen">Notes</h2>
            {!notes?.length ? (
              <p className="mt-2 text-sm text-muted">No notes yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {notes.map((note) => (
                  <li key={note.id} className="border-t border-border pt-3 text-sm">
                    <p className="text-xs text-muted">
                      {new Date(note.created_at).toLocaleString()}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap">{note.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex gap-3">
      <dt className="w-36 shrink-0 font-medium text-evergreen">{label}</dt>
      <dd className="text-muted">{value || "—"}</dd>
    </div>
  );
}
