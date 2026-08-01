"use client";

import { useMemo, useState } from "react";
import { services } from "@/data/services";
import { siteConfig } from "@/config/site";

type FieldErrors = Record<string, string[] | undefined>;

type PhotoMeta = {
  path: string;
  fileName?: string;
  contentType?: string;
  sizeBytes?: number;
};

const initial = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredContact: "phone",
  address: "",
  city: "Plainfield",
  zip: "",
  serviceType: "lawn-mowing",
  projectDescription: "",
  timeline: "",
  serviceFrequency: "one_time",
  propertyType: "residential",
  budgetRange: "",
  referralSource: "",
  preferredEstimateDate: "",
  preferredTimeWindow: "",
  estimateType: "onsite",
  consentContact: false,
  consentSms: false,
  website: "",
};

function readAttribution() {
  if (typeof window === "undefined") {
    return {
      utmSource: null as string | null,
      utmMedium: null as string | null,
      utmCampaign: null as string | null,
      utmTerm: null as string | null,
      utmContent: null as string | null,
      referrer: null as string | null,
      landingPage: null as string | null,
    };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmTerm: params.get("utm_term"),
    utmContent: params.get("utm_content"),
    referrer: document.referrer || null,
    landingPage: window.location.pathname,
  };
}

export function EstimateForm() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState(initial);
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const serviceOptions = useMemo(
    () =>
      services.map((s) => ({
        value: s.slug,
        label:
          s.status === "coming_soon"
            ? `${s.name} (${s.statusNote ?? "Coming soon"})`
            : s.name,
      })),
    [],
  );

  function update<K extends keyof typeof initial>(key: K, value: (typeof initial)[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function onFilesSelected(fileList: FileList | null) {
    if (!fileList?.length) return;
    setError(null);
    setUploading(true);
    const next: PhotoMeta[] = [...photos];
    try {
      for (const file of Array.from(fileList).slice(0, 8 - next.length)) {
        setUploadProgress(`Uploading ${file.name}…`);
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          throw new Error(json.error || "Upload failed");
        }
        next.push({
          path: json.path,
          fileName: json.fileName,
          contentType: json.contentType,
          sizeBytes: json.sizeBytes,
        });
      }
      setPhotos(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    try {
      const attribution = readAttribution();
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          photoPaths: photos,
          ...attribution,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setFieldErrors(json.fieldErrors ?? {});
        throw new Error(json.error || "Submission failed");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-leaf bg-leaf-soft p-8 text-center">
        <h2 className="font-display text-2xl text-evergreen-deep">Request received</h2>
        <p className="mt-3 text-muted">
          Thanks — we’ll review your details and follow up soon. {siteConfig.responseTime}
        </p>
        <p className="mt-4 text-sm text-muted">
          Need something sooner? Call{" "}
          <a className="font-semibold text-evergreen" href={siteConfig.phoneHref}>
            {siteConfig.phoneDisplay}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="flex gap-2 text-sm font-medium text-muted" aria-hidden>
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`rounded-full px-3 py-1 ${step === n ? "bg-evergreen text-white" : "bg-sand text-evergreen"}`}
          >
            Step {n}
          </span>
        ))}
      </div>

      {step === 1 ? (
        <fieldset className="space-y-4">
          <legend className="font-display text-xl text-evergreen-deep">Contact</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" error={fieldErrors.firstName?.[0]}>
              <input
                required
                className={inputClass}
                value={values.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                autoComplete="given-name"
              />
            </Field>
            <Field label="Last name" error={fieldErrors.lastName?.[0]}>
              <input
                required
                className={inputClass}
                value={values.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                autoComplete="family-name"
              />
            </Field>
            <Field label="Email" error={fieldErrors.email?.[0]}>
              <input
                required
                type="email"
                className={inputClass}
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
              />
            </Field>
            <Field label="Phone" error={fieldErrors.phone?.[0]}>
              <input
                required
                type="tel"
                className={inputClass}
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                autoComplete="tel"
              />
            </Field>
          </div>
          <Field label="Preferred contact method">
            <select
              className={inputClass}
              value={values.preferredContact}
              onChange={(e) => update("preferredContact", e.target.value)}
            >
              <option value="phone">Phone call</option>
              <option value="text">Text</option>
              <option value="email">Email</option>
            </select>
          </Field>
          <button
            type="button"
            className={primaryBtn}
            onClick={() => setStep(2)}
          >
            Continue
          </button>
        </fieldset>
      ) : null}

      {step === 2 ? (
        <fieldset className="space-y-4">
          <legend className="font-display text-xl text-evergreen-deep">Property & service</legend>
          <Field label="Property address" error={fieldErrors.address?.[0]}>
            <input
              required
              className={inputClass}
              value={values.address}
              onChange={(e) => update("address", e.target.value)}
              autoComplete="street-address"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" error={fieldErrors.city?.[0]}>
              <input
                required
                className={inputClass}
                value={values.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </Field>
            <Field label="ZIP" error={fieldErrors.zip?.[0]}>
              <input
                required
                className={inputClass}
                value={values.zip}
                onChange={(e) => update("zip", e.target.value)}
                autoComplete="postal-code"
              />
            </Field>
          </div>
          <Field label="Service" error={fieldErrors.serviceType?.[0]}>
            <select
              className={inputClass}
              value={values.serviceType}
              onChange={(e) => update("serviceType", e.target.value)}
            >
              {serviceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              <option value="multiple">Multiple / not sure</option>
            </select>
          </Field>
          <Field label="One-time or recurring">
            <select
              className={inputClass}
              value={values.serviceFrequency}
              onChange={(e) => update("serviceFrequency", e.target.value)}
            >
              <option value="one_time">One-time</option>
              <option value="recurring">Recurring</option>
            </select>
          </Field>
          <Field label="Property type">
            <select
              className={inputClass}
              value={values.propertyType}
              onChange={(e) => update("propertyType", e.target.value)}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </Field>
          <Field label="Project description">
            <textarea
              className={inputClass}
              rows={4}
              value={values.projectDescription}
              onChange={(e) => update("projectDescription", e.target.value)}
              placeholder="Tell us about the yard, goals, or problem areas."
            />
          </Field>
          <div className="flex gap-3">
            <button type="button" className={secondaryBtn} onClick={() => setStep(1)}>
              Back
            </button>
            <button type="button" className={primaryBtn} onClick={() => setStep(3)}>
              Continue
            </button>
          </div>
        </fieldset>
      ) : null}

      {step === 3 ? (
        <fieldset className="space-y-4">
          <legend className="font-display text-xl text-evergreen-deep">
            Timing & photos
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Desired timeline">
              <input
                className={inputClass}
                value={values.timeline}
                onChange={(e) => update("timeline", e.target.value)}
                placeholder="ASAP, this month, spring…"
              />
            </Field>
            <Field label="Budget range (optional)">
              <input
                className={inputClass}
                value={values.budgetRange}
                onChange={(e) => update("budgetRange", e.target.value)}
                placeholder="Optional"
              />
            </Field>
            <Field label="Preferred estimate date">
              <input
                type="date"
                className={inputClass}
                value={values.preferredEstimateDate}
                onChange={(e) => update("preferredEstimateDate", e.target.value)}
              />
            </Field>
            <Field label="Preferred time window">
              <input
                className={inputClass}
                value={values.preferredTimeWindow}
                onChange={(e) => update("preferredTimeWindow", e.target.value)}
                placeholder="Morning, afternoon…"
              />
            </Field>
          </div>
          <Field label="Estimate type">
            <select
              className={inputClass}
              value={values.estimateType}
              onChange={(e) => update("estimateType", e.target.value)}
            >
              <option value="onsite">On-site</option>
              <option value="virtual">Virtual / photos</option>
            </select>
          </Field>
          <Field label="How did you hear about us?">
            <input
              className={inputClass}
              value={values.referralSource}
              onChange={(e) => update("referralSource", e.target.value)}
            />
          </Field>
          <Field label="Property photos (optional, up to 8)">
            <input
              type="file"
              accept="image/*,.heic,.heif"
              capture="environment"
              multiple
              disabled={uploading || photos.length >= 8}
              onChange={(e) => onFilesSelected(e.target.files)}
              className="block w-full text-sm"
            />
            {uploadProgress ? (
              <p className="mt-2 text-sm text-muted">{uploadProgress}</p>
            ) : null}
            {photos.length > 0 ? (
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {photos.map((p) => (
                  <li key={p.path}>✓ {p.fileName ?? p.path}</li>
                ))}
              </ul>
            ) : null}
          </Field>

          <label className="flex items-start gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              className="mt-1"
              checked={values.consentContact}
              onChange={(e) => update("consentContact", e.target.checked)}
              required
            />
            <span>
              I agree to be contacted by {siteConfig.name} about this request.
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              className="mt-1"
              checked={values.consentSms}
              onChange={(e) => update("consentSms", e.target.checked)}
            />
            <span>
              Optional: I consent to receive SMS updates about this estimate. Message/data
              rates may apply. Reply STOP to opt out.
            </span>
          </label>

          {/* Honeypot */}
          <input
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden
            value={values.website}
            onChange={(e) => update("website", e.target.value)}
          />

          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex gap-3">
            <button type="button" className={secondaryBtn} onClick={() => setStep(2)}>
              Back
            </button>
            <button
              type="submit"
              className={primaryBtn}
              disabled={submitting || uploading}
            >
              {submitting ? "Sending…" : "Submit estimate request"}
            </button>
          </div>
        </fieldset>
      ) : null}
    </form>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block text-sm font-medium text-evergreen">
      {label}
      <div className="mt-1.5">{children}</div>
      {error ? <p className="mt-1 text-xs font-normal text-red-700">{error}</p> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-base text-foreground outline-none focus:border-leaf";
const primaryBtn =
  "inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60";
const secondaryBtn =
  "inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-3 text-sm font-semibold text-evergreen";
