import { ButtonLink } from "@/components/ui/button-link";
import { Section, SectionHeading } from "@/components/ui/section";
import { ContactForm } from "@/components/forms/contact-form";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/metadata";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Target Lawn Pro for lawn care in Plainfield. Call, text, or send a message.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Section className="bg-sand/40 pt-16">
        <SectionHeading
          eyebrow="Contact"
          title="Let’s talk about your yard"
          description={`${siteConfig.responseTime} Prefer the phone? We’re happy to help.`}
        />
      </Section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <a
              href={siteConfig.phoneHref}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface p-5 hover:bg-leaf-soft"
            >
              <Phone className="mt-0.5 size-5 text-leaf" aria-hidden />
              <div>
                <p className="font-semibold text-evergreen">Call or text</p>
                <p className="mt-1 text-muted">{siteConfig.phoneDisplay}</p>
              </div>
            </a>
            {siteConfig.email ? (
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface p-5 hover:bg-leaf-soft"
              >
                <Mail className="mt-0.5 size-5 text-leaf" aria-hidden />
                <div>
                  <p className="font-semibold text-evergreen">Email</p>
                  <p className="mt-1 break-all text-muted">{siteConfig.email}</p>
                </div>
              </a>
            ) : null}
            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-5">
              <MapPin className="mt-0.5 size-5 text-leaf" aria-hidden />
              <div>
                <p className="font-semibold text-evergreen">Service area</p>
                <p className="mt-1 text-muted">{siteConfig.serviceArea.summary}</p>
              </div>
            </div>
            <ButtonLink href="/request-estimate">Request a Free Estimate</ButtonLink>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="font-display text-2xl text-evergreen-deep">
              Send a message
            </h2>
            <p className="mt-2 text-sm text-muted">
              For detailed project quotes, the estimate form collects more useful details.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
