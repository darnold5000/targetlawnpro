import Link from "next/link";
import { notFound } from "next/navigation";
import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantIdOrNull } from "@/lib/tenant/deployment";
import { centsToDollars } from "@/lib/ops/schema";

type Props = { params: Promise<{ id: string }> };

export default async function AdminCustomerDetailPage({ params }: Props) {
  const { id } = await params;
  if (!isSupabaseConfigured() || !getWeidnerTenantIdOrNull()) notFound();

  const tenantId = getWeidnerTenantIdOrNull()!;
  const supabase = await createClient();
  const { data: customer } = await supabase
    .from(WEIDNER_TABLES.customers)
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (!customer) notFound();

  const [{ data: properties }, { data: estimates }, { data: jobs }, { data: recurring }] =
    await Promise.all([
      supabase
        .from(WEIDNER_TABLES.customerProperties)
        .select("*")
        .eq("customer_id", id),
      supabase
        .from(WEIDNER_TABLES.estimates)
        .select("id, status, total_cents, created_at")
        .eq("customer_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from(WEIDNER_TABLES.jobs)
        .select("id, status, scheduled_date, service_type")
        .eq("customer_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from(WEIDNER_TABLES.recurringServices)
        .select("id, service_name, frequency, active, price_cents")
        .eq("customer_id", id),
    ]);

  return (
    <div>
      <Link href="/admin/customers" className="text-sm text-muted hover:text-evergreen">
        ← Customers
      </Link>
      <h1 className="mt-4 font-display text-3xl text-evergreen-deep">
        {customer.first_name} {customer.last_name}
      </h1>
      <p className="mt-2 text-sm text-muted">
        <a href={`tel:${customer.phone}`} className="underline">
          {customer.phone}
        </a>
        {" · "}
        <a href={`mailto:${customer.email}`} className="underline">
          {customer.email}
        </a>
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-semibold text-evergreen">Properties</h2>
          {!properties?.length ? (
            <p className="mt-2 text-sm text-muted">No properties on file.</p>
          ) : (
            <ul className="mt-3 space-y-3 text-sm">
              {properties.map((p) => (
                <li key={p.id} className="border-t border-border pt-3">
                  <p className="font-medium">
                    {[p.address, p.city, p.zip].filter(Boolean).join(", ")}
                  </p>
                  {p.gate_code ? <p className="text-muted">Gate: {p.gate_code}</p> : null}
                  {p.pet_warnings ? (
                    <p className="text-muted">Pets: {p.pet_warnings}</p>
                  ) : null}
                  {p.access_instructions ? (
                    <p className="text-muted">Access: {p.access_instructions}</p>
                  ) : null}
                  {p.notes ? <p className="text-muted">{p.notes}</p> : null}
                </li>
              ))}
            </ul>
          )}
          {customer.notes ? (
            <div className="mt-4 border-t border-border pt-4 text-sm">
              <p className="font-medium text-evergreen">Notes</p>
              <p className="mt-1 whitespace-pre-wrap text-muted">{customer.notes}</p>
            </div>
          ) : null}
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-semibold text-evergreen">Estimates</h2>
            {!estimates?.length ? (
              <p className="mt-2 text-sm text-muted">None</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {estimates.map((e) => (
                  <li key={e.id}>
                    <Link href={`/admin/estimates/${e.id}`} className="text-leaf underline">
                      {e.status} · ${centsToDollars(e.total_cents)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-semibold text-evergreen">Jobs</h2>
            {!jobs?.length ? (
              <p className="mt-2 text-sm text-muted">None</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {jobs.map((j) => (
                  <li key={j.id}>
                    <Link href={`/admin/jobs/${j.id}`} className="text-leaf underline">
                      {j.status}
                      {j.scheduled_date ? ` · ${j.scheduled_date}` : ""}
                      {j.service_type ? ` · ${j.service_type}` : ""}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-semibold text-evergreen">Recurring</h2>
            {!recurring?.length ? (
              <p className="mt-2 text-sm text-muted">
                None — add from{" "}
                <Link href="/admin/recurring" className="underline">
                  Recurring
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {recurring.map((r) => (
                  <li key={r.id}>
                    {r.service_name} · {r.frequency}
                    {r.active ? "" : " (inactive)"}
                    {r.price_cents != null
                      ? ` · $${centsToDollars(r.price_cents)}`
                      : ""}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
