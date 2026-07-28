import { ButtonLink } from "@/components/ui/button-link";
import { Section, SectionHeading } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Service Area",
  description:
    "Weidner Lawnscape serves Zionsville and surrounding areas. Request an estimate to confirm availability for your address.",
  path: "/service-area",
});

export default function ServiceAreaPage() {
  return (
    <>
      <Section className="bg-sand/40 pt-16">
        <SectionHeading
          eyebrow="Service area"
          title={`Serving ${siteConfig.serviceArea.summary}`}
          description={siteConfig.serviceArea.note}
        />
      </Section>
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-8">
            <h2 className="font-display text-2xl text-evergreen-deep">
              Primary coverage
            </h2>
            <ul className="mt-4 space-y-2 text-muted">
              {siteConfig.serviceArea.cities.map((city) => (
                <li key={city}>• {city}, Indiana</li>
              ))}
              <li>• Surrounding communities (confirmed per request)</li>
            </ul>
            <p className="mt-6 text-sm text-muted">
              Residential and commercial properties may be considered based on location,
              scope, and crew capacity. Addresses outside our usual area are flagged for
              manual review rather than auto-rejected.
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-leaf-soft">
            <iframe
              title="Map of Zionsville, Indiana"
              src="https://maps.google.com/maps?q=Zionsville%2C%20IN&t=&z=12&ie=UTF8&iwloc=&output=embed"
              className="h-80 w-full border-0 lg:h-full min-h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/request-estimate">Check availability with an estimate</ButtonLink>
          <ButtonLink href={siteConfig.phoneHref} variant="secondary">
            Call {siteConfig.phoneDisplay}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
