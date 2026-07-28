import Link from "next/link";
import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantIdOrNull } from "@/lib/tenant/deployment";
import {
  ESTIMATE_STATUS_LABELS,
  type EstimateStatus,
  centsToDollars,
} from "@/lib/ops/schema";

export default async function AdminEstimatesPage() {
  if (!isSupabaseConfigured() || !getWeidnerTenantIdOrNull()) {
    return (
      <div>
        <h1 className="font-display text-3xl">Estimates</h1>
        <p className="mt-3 text-muted">Configure Supabase to manage estimates.</p>
      </div>
    );
  }

  const tenantId = getWeidnerTenantIdOrNull()!;
  const supabase = await createClient();
  const { data: estimates, error } = await supabase
    .from(WEIDNER_TABLES.estimates)
    .select("id, status, total_cents, lead_id, customer_id, created_at, expires_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-evergreen-deep">Estimates</h1>
          <p className="mt-2 text-muted">
            Lightweight line-item estimates — create from a lead or start blank.
          </p>
        </div>
        <Link
          href="/admin/estimates/new"
          className="rounded-md bg-evergreen px-4 py-2 text-sm font-semibold text-white"
        >
          New estimate
        </Link>
      </div>

      {error ? (
        <p className="mt-6 text-sm text-red-700">{error.message}</p>
      ) : !estimates?.length ? (
        <p className="mt-8 rounded-xl border border-dashed border-border bg-surface p-8 text-muted">
          No estimates yet. Open a lead and use <strong>Create estimate</strong>, or start
          from New estimate.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-sand/40 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Estimate</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((est) => (
                <tr key={est.id} className="border-b border-border/70">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/estimates/${est.id}`}
                      className="font-semibold text-evergreen hover:underline"
                    >
                      {est.id.slice(0, 8)}…
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {ESTIMATE_STATUS_LABELS[est.status as EstimateStatus] ?? est.status}
                  </td>
                  <td className="px-4 py-3">${centsToDollars(est.total_cents)}</td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(est.created_at).toLocaleDateString()}
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
