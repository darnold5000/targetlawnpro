import { Section, SectionHeading } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Terms",
  description: `Terms of use for ${siteConfig.name}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Section className="pt-16">
      <SectionHeading title="Terms of Use" />
      <div className="mt-8 max-w-3xl space-y-4 text-muted">
        <p>
          By using this website you agree to use it for lawful purposes related
          to learning about {siteConfig.name} services and requesting estimates
          or information.
        </p>
        <p>
          Estimate requests are inquiries, not contracts. Service pricing,
          scheduling, and scope are confirmed separately after we review your
          property and needs.
        </p>
        <p>
          Website content is provided for general information. For questions,
          contact{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or call{" "}
          {siteConfig.phoneDisplay}.
        </p>
      </div>
    </Section>
  );
}
