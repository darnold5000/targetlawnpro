"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { dollarsToCents } from "@/lib/ops/schema";

export function RecurringForm({
  customers,
}: {
  customers: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? "");
  const [serviceName, setServiceName] = useState("Weekly mowing");
  const [frequency, setFrequency] = useState("weekly");
  const [preferredDay, setPreferredDay] = useState("");
  const [startDate, setStartDate] = useState("");
  const [priceDollars, setPriceDollars] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/recurring", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        serviceName,
        frequency,
        preferredDay: preferredDay || null,
        startDate: startDate || null,
        priceCents: priceDollars ? dollarsToCents(priceDollars) : null,
        notes: notes || null,
        active: true,
        seasonalPause: false,
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok || !json.ok) {
      setError(json.error || "Could not create");
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <label className="block text-sm">
        Customer
        <select
          className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
        >
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Service
        <input
          className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          required
        />
      </label>
      <label className="block text-sm">
        Frequency
        <select
          className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="biweekly">Biweekly</option>
          <option value="monthly">Monthly</option>
          <option value="seasonal">Seasonal</option>
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          Preferred day
          <input
            className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
            value={preferredDay}
            onChange={(e) => setPreferredDay(e.target.value)}
            placeholder="Tuesday"
          />
        </label>
        <label className="block text-sm">
          Start date
          <input
            type="date"
            className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
      </div>
      <label className="block text-sm">
        Price $
        <input
          className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
          value={priceDollars}
          onChange={(e) => setPriceDollars(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        Notes
        <textarea
          className="mt-1.5 w-full rounded-md border border-border px-3 py-2"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={busy || !customerId}
        className="rounded-md bg-evergreen px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Saving…" : "Add recurring"}
      </button>
    </form>
  );
}
