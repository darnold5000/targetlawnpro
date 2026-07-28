import Link from "next/link";
import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantIdOrNull } from "@/lib/tenant/deployment";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/leads/schema";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  if (!isSupabaseConfigured() || !getWeidnerTenantIdOrNull()) {
    return (
      <div>
        <h1 className="font-display text-3xl">Leads</h1>
        <p className="mt-3 text-muted">Configure Supabase to load leads.</p>
      </div>
    );
  }

  const tenantId = getWeidnerTenantIdOrNull()!;
  const supabase = await createClient();
  let query = supabase
    .from(WEIDNER_TABLES.leads)
    .select(
      "id, first_name, last_name, email, phone, service_type, status, city, created_at, outside_service_area",
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) query = query.eq("status", status);

  const { data: leads, error } = await query;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-evergreen-deep">Leads</h1>
          <p className="mt-2 text-muted">Estimate and contact requests.</p>
        </div>
        <Link href="/admin/leads?status=new" className="text-sm font-semibold text-leaf">
          New only
        </Link>
      </div>

      {error ? (
        <p className="mt-6 text-sm text-red-700">{error.message}</p>
      ) : !leads?.length ? (
        <p className="mt-8 rounded-xl border border-dashed border-border bg-surface p-8 text-muted">
          No leads yet. Submissions from the estimate form will appear here.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-sand/40 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-border/70">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-semibold text-evergreen hover:underline"
                    >
                      {lead.first_name} {lead.last_name}
                    </Link>
                    {lead.outside_service_area ? (
                      <span className="ml-2 text-xs text-accent">Outside area</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-muted">{lead.service_type}</td>
                  <td className="px-4 py-3">
                    {LEAD_STATUS_LABELS[lead.status as LeadStatus] ?? lead.status}
                  </td>
                  <td className="px-4 py-3 text-muted">{lead.city}</td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
