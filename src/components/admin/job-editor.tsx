"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { JOB_STATUSES, JOB_STATUS_LABELS } from "@/lib/ops/schema";

export function JobEditor({
  mode,
  jobId,
  initial,
}: {
  mode: "create" | "edit";
  jobId?: string;
  initial?: {
    status: string;
    serviceType: string;
    scheduledDate: string;
    arrivalWindow: string;
    instructions: string;
    internalNotes: string;
    customerId: string;
    estimateId: string;
    leadId: string;
  };
}) {
  const router = useRouter();
  const search = useSearchParams();
  const [status, setStatus] = useState(initial?.status ?? "unscheduled");
  const [serviceType, setServiceType] = useState(initial?.serviceType ?? "");
  const [scheduledDate, setScheduledDate] = useState(initial?.scheduledDate ?? "");
  const [arrivalWindow, setArrivalWindow] = useState(initial?.arrivalWindow ?? "");
  const [instructions, setInstructions] = useState(initial?.instructions ?? "");
  const [internalNotes, setInternalNotes] = useState(initial?.internalNotes ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const customerId = initial?.customerId || search.get("customerId") || "";
  const estimateId = initial?.estimateId || search.get("estimateId") || "";
  const leadId = initial?.leadId || search.get("leadId") || "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = {
      status,
      serviceType: serviceType || null,
      scheduledDate: scheduledDate || null,
      arrivalWindow: arrivalWindow || null,
      instructions: instructions || null,
      internalNotes: internalNotes || null,
      customerId: customerId || null,
      estimateId: estimateId || null,
      leadId: leadId || null,
    };
    const res = await fetch(
      mode === "create" ? "/api/admin/jobs" : `/api/admin/jobs/${jobId}`,
      {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const json = await res.json();
    setBusy(false);
    if (!res.ok || !json.ok) {
      setError(json.error || "Save failed");
      return;
    }
    router.push(`/admin/jobs/${mode === "create" ? json.id : jobId}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-xl space-y-4">
      <label className="block text-sm font-medium">
        Status
        <select
          className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {JOB_STATUSES.map((s) => (
            <option key={s} value={s}>
              {JOB_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium">
        Service type
        <input
          className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Scheduled date
          <input
            type="date"
            className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium">
          Arrival window
          <input
            className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
            value={arrivalWindow}
            onChange={(e) => setArrivalWindow(e.target.value)}
            placeholder="8–10am"
          />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Crew / customer instructions
        <textarea
          className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
          rows={3}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </label>
      <label className="block text-sm font-medium">
        Internal notes
        <textarea
          className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
          rows={3}
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
        />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-md bg-evergreen px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Saving…" : mode === "create" ? "Create job" : "Save job"}
      </button>
    </form>
  );
}
