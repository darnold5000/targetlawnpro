import Link from "next/link";
import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantIdOrNull } from "@/lib/tenant/deployment";

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured() || !getWeidnerTenantIdOrNull()) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <h1 className="font-display text-2xl text-evergreen-deep">Dashboard</h1>
        <p className="mt-3 text-muted">
          Connect Supabase and set <code>WEIDNER_TENANT_ID</code> to load live metrics.
          Apply migrations in <code>supabase-signalworks/migrations</code> first.
        </p>
      </div>
    );
  }

  const tenantId = getWeidnerTenantIdOrNull()!;
  const supabase = await createClient();
  const now = new Date();
  const weekAhead = new Date(now);
  weekAhead.setDate(weekAhead.getDate() + 7);
  const today = now.toISOString().slice(0, 10);
  const week = weekAhead.toISOString().slice(0, 10);

  const [
    { count: newLeads },
    { count: followUps },
    { count: estimatesAwaiting },
    { count: jobsToday },
    { count: jobsWeek },
    { count: recurring },
  ] = await Promise.all([
    supabase
      .from(WEIDNER_TABLES.leads)
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "new"),
    supabase
      .from(WEIDNER_TABLES.leads)
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .not("follow_up_at", "is", null)
      .lte("follow_up_at", now.toISOString())
      .neq("status", "archived"),
    supabase
      .from(WEIDNER_TABLES.estimates)
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "sent"),
    supabase
      .from(WEIDNER_TABLES.jobs)
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("scheduled_date", today),
    supabase
      .from(WEIDNER_TABLES.jobs)
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .gte("scheduled_date", today)
      .lte("scheduled_date", week),
    supabase
      .from(WEIDNER_TABLES.recurringServices)
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("active", true),
  ]);

  const cards = [
    { label: "New leads", value: newLeads ?? 0, href: "/admin/leads?status=new" },
    { label: "Follow-ups due", value: followUps ?? 0, href: "/admin/leads" },
    { label: "Estimates awaiting approval", value: estimatesAwaiting ?? 0, href: "/admin/estimates" },
    { label: "Jobs today", value: jobsToday ?? 0, href: "/admin/jobs" },
    { label: "Jobs this week", value: jobsWeek ?? 0, href: "/admin/jobs" },
    { label: "Active recurring", value: recurring ?? 0, href: "/admin/recurring" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-evergreen-deep">Dashboard</h1>
      <p className="mt-2 text-muted">A practical snapshot — not a dense analytics suite.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-border bg-surface p-5 hover:border-leaf"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 font-display text-3xl text-evergreen">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
