import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantIdOrNull } from "@/lib/tenant/deployment";
import { JobEditor } from "@/components/admin/job-editor";
import { JOB_STATUS_LABELS, type JobStatus } from "@/lib/ops/schema";

type Props = { params: Promise<{ id: string }> };

export default async function AdminJobDetailPage({ params }: Props) {
  const { id } = await params;
  if (!isSupabaseConfigured() || !getWeidnerTenantIdOrNull()) notFound();

  const tenantId = getWeidnerTenantIdOrNull()!;
  const supabase = await createClient();
  const { data: job } = await supabase
    .from(WEIDNER_TABLES.jobs)
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (!job) notFound();

  return (
    <div>
      <Link href="/admin/jobs" className="text-sm text-muted hover:text-evergreen">
        ← Jobs
      </Link>
      <h1 className="mt-4 font-display text-3xl text-evergreen-deep">
        Job {id.slice(0, 8)}
      </h1>
      <p className="mt-1 text-muted">
        {JOB_STATUS_LABELS[job.status as JobStatus] ?? job.status}
        {job.lead_id ? (
          <>
            {" · "}
            <Link href={`/admin/leads/${job.lead_id}`} className="text-leaf underline">
              Lead
            </Link>
          </>
        ) : null}
        {job.estimate_id ? (
          <>
            {" · "}
            <Link
              href={`/admin/estimates/${job.estimate_id}`}
              className="text-leaf underline"
            >
              Estimate
            </Link>
          </>
        ) : null}
        {job.customer_id ? (
          <>
            {" · "}
            <Link
              href={`/admin/customers/${job.customer_id}`}
              className="text-leaf underline"
            >
              Customer
            </Link>
          </>
        ) : null}
      </p>
      <Suspense fallback={<p className="mt-6 text-muted">Loading…</p>}>
        <JobEditor
          mode="edit"
          jobId={job.id}
          initial={{
            status: job.status,
            serviceType: job.service_type ?? "",
            scheduledDate: job.scheduled_date ?? "",
            arrivalWindow: job.arrival_window ?? "",
            instructions: job.instructions ?? "",
            internalNotes: job.internal_notes ?? "",
            customerId: job.customer_id ?? "",
            estimateId: job.estimate_id ?? "",
            leadId: job.lead_id ?? "",
          }}
        />
      </Suspense>
    </div>
  );
}
