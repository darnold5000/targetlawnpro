import Link from "next/link";
import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantIdOrNull } from "@/lib/tenant/deployment";
import { JOB_STATUS_LABELS, type JobStatus } from "@/lib/ops/schema";

export default async function AdminJobsPage() {
  if (!isSupabaseConfigured() || !getWeidnerTenantIdOrNull()) {
    return (
      <div>
        <h1 className="font-display text-3xl">Jobs</h1>
        <p className="mt-3 text-muted">Configure Supabase to manage jobs.</p>
      </div>
    );
  }

  const tenantId = getWeidnerTenantIdOrNull()!;
  const supabase = await createClient();
  const { data: jobs, error } = await supabase
    .from(WEIDNER_TABLES.jobs)
    .select(
      "id, status, service_type, scheduled_date, arrival_window, customer_id, lead_id, created_at",
    )
    .eq("tenant_id", tenantId)
    .order("scheduled_date", { ascending: true, nullsFirst: false })
    .limit(100);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-evergreen-deep">Jobs</h1>
          <p className="mt-2 text-muted">
            Schedule and track work without a heavy field-service stack.
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="rounded-md bg-evergreen px-4 py-2 text-sm font-semibold text-white"
        >
          New job
        </Link>
      </div>

      {error ? (
        <p className="mt-6 text-sm text-red-700">{error.message}</p>
      ) : !jobs?.length ? (
        <p className="mt-8 rounded-xl border border-dashed border-border bg-surface p-8 text-muted">
          No jobs yet. Convert an approved estimate or create one from a lead.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-sand/40 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Job</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-border/70">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/jobs/${job.id}`}
                      className="font-semibold text-evergreen hover:underline"
                    >
                      {job.id.slice(0, 8)}…
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{job.service_type || "—"}</td>
                  <td className="px-4 py-3">
                    {JOB_STATUS_LABELS[job.status as JobStatus] ?? job.status}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {job.scheduled_date || "Unscheduled"}
                    {job.arrival_window ? ` · ${job.arrival_window}` : ""}
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
