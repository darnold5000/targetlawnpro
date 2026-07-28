import Link from "next/link";
import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantIdOrNull } from "@/lib/tenant/deployment";
import { RecurringForm } from "@/components/admin/recurring-form";
import { centsToDollars } from "@/lib/ops/schema";

export default async function AdminRecurringPage() {
  if (!isSupabaseConfigured() || !getWeidnerTenantIdOrNull()) {
    return (
      <div>
        <h1 className="font-display text-3xl">Recurring services</h1>
        <p className="mt-3 text-muted">Configure Supabase to manage recurring work.</p>
      </div>
    );
  }

  const tenantId = getWeidnerTenantIdOrNull()!;
  const supabase = await createClient();
  const [{ data: recurring, error }, { data: customers }] = await Promise.all([
    supabase
      .from(WEIDNER_TABLES.recurringServices)
      .select(
        "id, service_name, frequency, preferred_day, price_cents, active, seasonal_pause, customer_id, start_date, notes",
      )
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false }),
    supabase
      .from(WEIDNER_TABLES.customers)
      .select("id, first_name, last_name")
      .eq("tenant_id", tenantId)
      .order("last_name", { ascending: true }),
  ]);

  const customerName = new Map(
    (customers ?? []).map((c) => [c.id, `${c.first_name} ${c.last_name}`]),
  );

  return (
    <div>
      <h1 className="font-display text-3xl text-evergreen-deep">Recurring services</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Track weekly mowing and seasonal plans. Jobs are not auto-generated in bulk —
        schedule occurrences as needed.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-semibold text-evergreen">Add recurring service</h2>
          {(customers ?? []).length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              Convert a lead to a customer first, then add recurring service here.
            </p>
          ) : (
            <RecurringForm
              customers={(customers ?? []).map((c) => ({
                id: c.id,
                label: `${c.first_name} ${c.last_name}`,
              }))}
            />
          )}
        </div>

        <div>
          {error ? (
            <p className="text-sm text-red-700">{error.message}</p>
          ) : !recurring?.length ? (
            <p className="rounded-xl border border-dashed border-border bg-surface p-8 text-sm text-muted">
              No recurring services yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {recurring.map((row) => (
                <li
                  key={row.id}
                  className="rounded-xl border border-border bg-surface p-4 text-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-evergreen">{row.service_name}</p>
                      <p className="mt-1 text-muted">
                        {customerName.get(row.customer_id) ?? "Customer"} · {row.frequency}
                        {row.preferred_day ? ` · ${row.preferred_day}` : ""}
                      </p>
                      {row.price_cents != null ? (
                        <p className="mt-1 text-muted">
                          ${centsToDollars(row.price_cents)}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-right text-xs">
                      <p>{row.active ? "Active" : "Inactive"}</p>
                      {row.seasonal_pause ? <p>Seasonal pause</p> : null}
                    </div>
                  </div>
                  <Link
                    href={`/admin/customers/${row.customer_id}`}
                    className="mt-3 inline-block text-leaf underline"
                  >
                    View customer
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
