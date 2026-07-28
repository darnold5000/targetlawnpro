"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/lib/leads/schema";

export function LeadActions({
  leadId,
  status,
  customerId,
  serviceType,
}: {
  leadId: string;
  status: string;
  customerId?: string | null;
  serviceType?: string | null;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function saveStatus() {
    setBusy(true);
    setMessage(null);
    const res = await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: current }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok || !json.ok) {
      setMessage(json.error || "Update failed");
      return;
    }
    setMessage("Status updated");
    router.refresh();
  }

  async function addNote() {
    if (!note.trim()) return;
    setBusy(true);
    setMessage(null);
    const res = await fetch(`/api/admin/leads/${leadId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: note }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok || !json.ok) {
      setMessage(json.error || "Could not add note");
      return;
    }
    setNote("");
    setMessage("Note added");
    router.refresh();
  }

  async function convertToCustomer() {
    setBusy(true);
    setMessage(null);
    const res = await fetch(`/api/admin/leads/${leadId}/convert`, {
      method: "POST",
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok || !json.ok) {
      setMessage(json.error || "Convert failed");
      return;
    }
    setMessage(
      json.alreadyConverted
        ? "Already linked to a customer"
        : "Converted to customer",
    );
    router.refresh();
  }

  async function createDraftEstimate() {
    setBusy(true);
    setMessage(null);
    let linkedCustomerId = customerId;
    if (!linkedCustomerId) {
      const convertRes = await fetch(`/api/admin/leads/${leadId}/convert`, {
        method: "POST",
      });
      const convertJson = await convertRes.json();
      if (!convertRes.ok || !convertJson.ok) {
        setBusy(false);
        setMessage(convertJson.error || "Convert failed before estimate");
        return;
      }
      linkedCustomerId = convertJson.customerId;
    }

    const res = await fetch("/api/admin/estimates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId,
        customerId: linkedCustomerId,
        status: "draft",
        notes: serviceType ? `From lead — ${serviceType}` : "From lead",
        items: [
          {
            description: serviceType || "Lawn / landscape service",
            quantity: 1,
            unit: "job",
            rateCents: 0,
          },
        ],
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok || !json.ok) {
      setMessage(json.error || "Could not create estimate");
      return;
    }
    router.push(`/admin/estimates/${json.id}`);
  }

  async function createJob() {
    setBusy(true);
    setMessage(null);
    let linkedCustomerId = customerId;
    if (!linkedCustomerId) {
      const convertRes = await fetch(`/api/admin/leads/${leadId}/convert`, {
        method: "POST",
      });
      const convertJson = await convertRes.json();
      if (!convertRes.ok || !convertJson.ok) {
        setBusy(false);
        setMessage(convertJson.error || "Convert failed before job");
        return;
      }
      linkedCustomerId = convertJson.customerId;
    }

    const res = await fetch("/api/admin/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId,
        customerId: linkedCustomerId,
        serviceType: serviceType || undefined,
        status: "unscheduled",
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok || !json.ok) {
      setMessage(json.error || "Could not create job");
      return;
    }
    router.push(`/admin/jobs/${json.id}`);
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <h2 className="font-semibold text-evergreen">Update lead</h2>
      <label className="block text-sm">
        Status
        <select
          className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        disabled={busy}
        onClick={saveStatus}
        className="rounded-md bg-evergreen px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        Save status
      </button>

      <div className="flex flex-wrap gap-2 border-t border-border pt-4">
        <button
          type="button"
          disabled={busy}
          onClick={convertToCustomer}
          className="rounded-md border border-border px-3 py-2 text-sm font-semibold"
        >
          {customerId ? "Customer linked" : "Convert to customer"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={createDraftEstimate}
          className="rounded-md border border-border px-3 py-2 text-sm font-semibold"
        >
          Create estimate
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={createJob}
          className="rounded-md border border-border px-3 py-2 text-sm font-semibold"
        >
          Create job
        </button>
      </div>

      <label className="block text-sm">
        Add note
        <textarea
          className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      <button
        type="button"
        disabled={busy}
        onClick={addNote}
        className="rounded-md border border-border px-4 py-2 text-sm font-semibold"
      >
        Add note
      </button>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </div>
  );
}
