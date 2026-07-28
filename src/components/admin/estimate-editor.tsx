"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { dollarsToCents } from "@/lib/ops/schema";

type Line = {
  description: string;
  quantity: string;
  unit: string;
  rateDollars: string;
};

export function EstimateEditor({
  mode,
  estimateId,
  initial,
  leadId,
  customerId,
}: {
  mode: "create" | "edit";
  estimateId?: string;
  leadId?: string | null;
  customerId?: string | null;
  initial?: {
    status: string;
    notes: string;
    terms: string;
    expiresAt: string;
    discountDollars: string;
    taxDollars: string;
    items: Line[];
  };
}) {
  const router = useRouter();
  const search = useSearchParams();
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [terms, setTerms] = useState(initial?.terms ?? "");
  const [expiresAt, setExpiresAt] = useState(initial?.expiresAt ?? "");
  const [discountDollars, setDiscountDollars] = useState(
    initial?.discountDollars ?? "0",
  );
  const [taxDollars, setTaxDollars] = useState(initial?.taxDollars ?? "0");
  const [items, setItems] = useState<Line[]>(
    initial?.items ?? [
      { description: "", quantity: "1", unit: "job", rateDollars: "0" },
    ],
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedLeadId = leadId ?? search.get("leadId");
  const resolvedCustomerId = customerId ?? search.get("customerId");

  function updateItem(index: number, patch: Partial<Line>) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = {
      leadId: resolvedLeadId || null,
      customerId: resolvedCustomerId || null,
      status,
      notes,
      terms,
      expiresAt: expiresAt || null,
      discountCents: dollarsToCents(discountDollars),
      taxCents: dollarsToCents(taxDollars),
      items: items.map((item) => ({
        description: item.description,
        quantity: Number(item.quantity) || 1,
        unit: item.unit,
        rateCents: dollarsToCents(item.rateDollars),
      })),
    };

    const res = await fetch(
      mode === "create"
        ? "/api/admin/estimates"
        : `/api/admin/estimates/${estimateId}`,
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
    router.push(`/admin/estimates/${mode === "create" ? json.id : estimateId}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-3xl space-y-5">
      <label className="block text-sm font-medium">
        Status
        <select
          className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
          <option value="expired">Expired</option>
        </select>
      </label>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-evergreen">Line items</h2>
          <button
            type="button"
            className="text-sm font-semibold text-leaf"
            onClick={() =>
              setItems((prev) => [
                ...prev,
                { description: "", quantity: "1", unit: "", rateDollars: "0" },
              ])
            }
          >
            Add line
          </button>
        </div>
        {items.map((item, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-4"
          >
            <input
              required
              placeholder="Description"
              className="rounded-md border border-border px-3 py-2 sm:col-span-4"
              value={item.description}
              onChange={(e) => updateItem(index, { description: e.target.value })}
            />
            <input
              placeholder="Qty"
              className="rounded-md border border-border px-3 py-2"
              value={item.quantity}
              onChange={(e) => updateItem(index, { quantity: e.target.value })}
            />
            <input
              placeholder="Unit"
              className="rounded-md border border-border px-3 py-2"
              value={item.unit}
              onChange={(e) => updateItem(index, { unit: e.target.value })}
            />
            <input
              placeholder="Rate $"
              className="rounded-md border border-border px-3 py-2 sm:col-span-2"
              value={item.rateDollars}
              onChange={(e) => updateItem(index, { rateDollars: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          Discount $
          <input
            className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
            value={discountDollars}
            onChange={(e) => setDiscountDollars(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          Tax $
          <input
            className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
            value={taxDollars}
            onChange={(e) => setTaxDollars(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          Expires
          <input
            type="date"
            className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </label>
      </div>

      <label className="block text-sm">
        Customer-facing notes
        <textarea
          className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        Terms
        <textarea
          className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
          rows={3}
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
        />
      </label>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="rounded-md bg-evergreen px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Saving…" : mode === "create" ? "Create estimate" : "Save changes"}
      </button>
    </form>
  );
}
