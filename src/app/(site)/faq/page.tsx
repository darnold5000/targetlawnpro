import { Section, SectionHeading } from "@/components/ui/section";
import { faqs } from "@/data/faqs";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata = createPageMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about Weidner Lawnscape services, service area, and estimates.",
  path: "/faq",
});

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section className="bg-sand/40 pt-16">
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions"
          description="Straight answers about services, coverage, and how estimates work."
        />
      </Section>
      <Section>
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="cursor-pointer list-none font-semibold text-evergreen">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="text-leaf transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
        <div className="mt-10">
          <p className="text-muted">Still have a question?</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact">Contact us</ButtonLink>
            <ButtonLink href={siteConfig.phoneHref} variant="secondary">
              Call {siteConfig.phoneDisplay}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
