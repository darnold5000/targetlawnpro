import { siteConfig } from "@/config/site";
import { allowIndexing } from "@/config/site";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-evergreen-deep">Settings</h1>
      <dl className="mt-8 space-y-4 rounded-xl border border-border bg-surface p-6 text-sm">
        <div>
          <dt className="font-medium text-evergreen">Business</dt>
          <dd className="text-muted">{siteConfig.name}</dd>
        </div>
        <div>
          <dt className="font-medium text-evergreen">Phone</dt>
          <dd className="text-muted">{siteConfig.phoneDisplay}</dd>
        </div>
        <div>
          <dt className="font-medium text-evergreen">Email</dt>
          <dd className="text-muted">{siteConfig.email || "Not set — use phone or estimate form"}</dd>
        </div>
        <div>
          <dt className="font-medium text-evergreen">Service area</dt>
          <dd className="text-muted">{siteConfig.serviceArea.summary}</dd>
        </div>
        <div>
          <dt className="font-medium text-evergreen">Search indexing</dt>
          <dd className="text-muted">
            {allowIndexing()
              ? "Enabled (NEXT_PUBLIC_ALLOW_INDEXING=true)"
              : "Disabled — staging/demo default (noindex)"}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-evergreen">Tenant slug</dt>
          <dd className="text-muted">weidner-lawnscape</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-muted">
        Editable CMS for promotions and hours can be added later; public content
        currently lives in typed files under <code>src/data</code> and{" "}
        <code>src/config</code>.
      </p>
    </div>
  );
}
