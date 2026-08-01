import { Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Section, SectionHeading } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Customer Reviews",
  description:
    "Google Business reviews and ratings for Target Lawn Pro lawn care in Plainfield, Indiana.",
  path: "/reviews",
});

export default function ReviewsPage() {
  const { googleBusiness } = siteConfig;

  return (
    <>
      <Section className="bg-sand/40 pt-16">
        <SectionHeading
          eyebrow="Reviews"
          title="Google reviews"
          description="We only publish review information we can verify publicly. Named customer quotes are not listed until provided."
        />
      </Section>
      <Section>
        <div className="max-w-2xl rounded-xl border border-border bg-surface p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-2 text-evergreen">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="size-5 fill-accent text-accent" aria-hidden />
            ))}
            <span className="ml-2 font-display text-3xl">
              {googleBusiness.rating.toFixed(1)}
            </span>
            <span className="text-sm text-muted">
              {googleBusiness.reviewCount} Google review
              {googleBusiness.reviewCount === 1 ? "" : "s"}
            </span>
          </div>
          <blockquote className="mt-8 border-l-4 border-leaf pl-4">
            <p className="text-lg leading-relaxed text-foreground">
              “{googleBusiness.ownerQuote}”
            </p>
            <footer className="mt-4 text-sm text-muted">
              Business description on Google — not a named customer testimonial
            </footer>
          </blockquote>
        </div>

        <div className="mt-12 rounded-xl bg-leaf-soft p-8 text-center">
          <h2 className="font-display text-2xl text-evergreen-deep">
            Had a great experience?
          </h2>
          <p className="mt-2 text-muted">
            Leave a review on Google to help other Plainfield homeowners find us.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/request-estimate" variant="secondary">
              Request an Estimate
            </ButtonLink>
            <ButtonLink href={siteConfig.phoneHref}>Call {siteConfig.phoneDisplay}</ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
