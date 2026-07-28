import { Section, SectionHeading } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Section className="pt-16">
      <SectionHeading title="Privacy Policy" />
      <div className="prose mt-8 max-w-3xl space-y-4 text-muted">
        <p>
          {siteConfig.name} (“we”) collects information you submit through our
          website forms (such as name, email, phone, property address, project
          details, and photos) so we can respond to estimate and contact
          requests.
        </p>
        <p>
          We may also collect basic technical and attribution data (such as
          referrer, landing page, and UTM parameters) to understand how visitors
          find us. We do not sell your personal information.
        </p>
        <p>
          Photos you upload are used to evaluate your property and communicate
          about your request. Contact us at{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> to ask
          about access or deletion of your information.
        </p>
        <p className="text-sm">
          This page summarizes practices for the rebuilt site. A fuller legal
          review can replace this language before public launch if desired.
        </p>
      </div>
    </Section>
  );
}
