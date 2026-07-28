"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

export function ContactForm() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    consentContact: false,
    website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <p className="rounded-md bg-leaf-soft px-4 py-3 text-sm text-evergreen" role="status">
        Message sent. We’ll get back to you soon — or call {siteConfig.phoneDisplay}.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-evergreen">
          First name
          <input
            required
            className={inputClass}
            value={values.firstName}
            onChange={(e) => setValues({ ...values, firstName: e.target.value })}
          />
        </label>
        <label className="text-sm font-medium text-evergreen">
          Last name
          <input
            required
            className={inputClass}
            value={values.lastName}
            onChange={(e) => setValues({ ...values, lastName: e.target.value })}
          />
        </label>
      </div>
      <label className="block text-sm font-medium text-evergreen">
        Email
        <input
          required
          type="email"
          className={inputClass}
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
      </label>
      <label className="block text-sm font-medium text-evergreen">
        Phone
        <input
          required
          type="tel"
          className={inputClass}
          value={values.phone}
          onChange={(e) => setValues({ ...values, phone: e.target.value })}
        />
      </label>
      <label className="block text-sm font-medium text-evergreen">
        Message
        <textarea
          required
          rows={5}
          className={inputClass}
          value={values.message}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
        />
      </label>
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          checked={values.consentContact}
          onChange={(e) =>
            setValues({ ...values, consentContact: e.target.checked })
          }
          required
        />
        I agree to be contacted about this message.
      </label>
      <input
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={values.website}
        onChange={(e) => setValues({ ...values, website: e.target.value })}
      />
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-base";
