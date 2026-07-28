"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ConvertEstimateToJob({
  estimateId,
  customerId,
  leadId,
}: {
  estimateId: string;
  customerId?: string | null;
  leadId?: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function convert() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estimateId,
        customerId: customerId || null,
        leadId: leadId || null,
        status: "unscheduled",
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok || !json.ok) {
      setError(json.error || "Could not create job");
      return;
    }
    router.push(`/admin/jobs/${json.id}`);
  }

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={convert}
        className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold disabled:opacity-60"
      >
        {busy ? "Converting…" : "Convert to job"}
      </button>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
