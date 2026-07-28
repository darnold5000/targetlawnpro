import Link from "next/link";
import { notFound } from "next/navigation";
import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantIdOrNull } from "@/lib/tenant/deployment";
import { EstimateEditor } from "@/components/admin/estimate-editor";
import { ConvertEstimateToJob } from "@/components/admin/convert-estimate-to-job";
import {
  ESTIMATE_STATUS_LABELS,
  type EstimateStatus,
  centsToDollars,
} from "@/lib/ops/schema";
import { Suspense } from "react";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEstimateDetailPage({ params }: Props) {
  const { id } = await params;
  if (!isSupabaseConfigured() || !getWeidnerTenantIdOrNull()) notFound();

  const tenantId = getWeidnerTenantIdOrNull()!;
  const supabase = await createClient();
  const { data: estimate } = await supabase
    .from(WEIDNER_TABLES.estimates)
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (!estimate) notFound();

  const { data: items } = await supabase
    .from(WEIDNER_TABLES.estimateItems)
    .select("*")
    .eq("estimate_id", id)
    .order("sort_order", { ascending: true });

  return (
    <div>
      <Link href="/admin/estimates" className="text-sm text-muted hover:text-evergreen">
        ← Estimates
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-evergreen-deep">
            Estimate {id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-muted">
            {ESTIMATE_STATUS_LABELS[estimate.status as EstimateStatus] ?? estimate.status}
            {" · "}${centsToDollars(estimate.total_cents)}
            {estimate.lead_id ? (
              <>
                {" · "}
                <Link href={`/admin/leads/${estimate.lead_id}`} className="text-leaf underline">
                  Lead
                </Link>
              </>
            ) : null}
            {estimate.customer_id ? (
              <>
                {" · "}
                <Link
                  href={`/admin/customers/${estimate.customer_id}`}
                  className="text-leaf underline"
                >
                  Customer
                </Link>
              </>
            ) : null}
          </p>
        </div>
        <ConvertEstimateToJob
          estimateId={estimate.id}
          customerId={estimate.customer_id}
          leadId={estimate.lead_id}
        />
      </div>

      <Suspense fallback={<p className="mt-6 text-muted">Loading editor…</p>}>
        <EstimateEditor
          mode="edit"
          estimateId={estimate.id}
          leadId={estimate.lead_id}
          customerId={estimate.customer_id}
          initial={{
            status: estimate.status,
            notes: estimate.notes ?? "",
            terms: estimate.terms ?? "",
            expiresAt: estimate.expires_at ?? "",
            discountDollars: centsToDollars(estimate.discount_cents),
            taxDollars: centsToDollars(estimate.tax_cents),
            items: (items ?? []).map((item) => ({
              description: item.description,
              quantity: String(item.quantity),
              unit: item.unit ?? "",
              rateDollars: centsToDollars(item.rate_cents),
            })),
          }}
        />
      </Suspense>
    </div>
  );
}
