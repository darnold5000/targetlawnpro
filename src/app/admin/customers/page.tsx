import Link from "next/link";
import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantIdOrNull } from "@/lib/tenant/deployment";

export default async function AdminCustomersPage() {
  if (!isSupabaseConfigured() || !getWeidnerTenantIdOrNull()) {
    return (
      <div>
        <h1 className="font-display text-3xl">Customers</h1>
        <p className="mt-3 text-muted">Configure Supabase to load customers.</p>
      </div>
    );
  }

  const tenantId = getWeidnerTenantIdOrNull()!;
  const supabase = await createClient();
  const { data: customers, error } = await supabase
    .from(WEIDNER_TABLES.customers)
    .select("id, first_name, last_name, email, phone, created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="font-display text-3xl text-evergreen-deep">Customers</h1>
      <p className="mt-2 text-muted">
        Created when you convert a lead. Property notes stay on the customer record.
      </p>

      {error ? (
        <p className="mt-6 text-sm text-red-700">{error.message}</p>
      ) : !customers?.length ? (
        <p className="mt-8 rounded-xl border border-dashed border-border bg-surface p-8 text-muted">
          No customers yet. Open a lead and choose <strong>Convert to customer</strong>.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-sand/40 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Added</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-border/70">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="font-semibold text-evergreen hover:underline"
                    >
                      {c.first_name} {c.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{c.email}</td>
                  <td className="px-4 py-3 text-muted">{c.phone}</td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(c.created_at).toLocaleDateString()}
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
