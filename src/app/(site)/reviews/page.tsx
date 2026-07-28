import { ButtonLink } from "@/components/ui/button-link";
import { Section, SectionHeading } from "@/components/ui/section";
import { reviews } from "@/data/reviews";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Customer Reviews",
  description:
    "Read homeowner testimonials about Weidner Lawnscape lawn care and landscaping in Zionsville.",
  path: "/reviews",
});

export default function ReviewsPage() {
  return (
    <>
      <Section className="bg-sand/40 pt-16">
        <SectionHeading
          eyebrow="Reviews"
          title="Trusted by local homeowners"
          description="These testimonials appear on the existing Weidner Lawnscape website. We don’t invent reviews."
        />
      </Section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <blockquote
              key={review.id}
              className="border border-border bg-surface p-6 sm:p-8"
            >
              <p className="text-lg leading-relaxed text-foreground">
                “{review.body}”
              </p>
              <footer className="mt-6">
                <p className="font-semibold text-evergreen">{review.name}</p>
                <p className="text-sm text-muted">{review.locationLabel}</p>
              </footer>
            </blockquote>
          ))}
        </div>
        <div className="mt-12 rounded-xl bg-leaf-soft p-8 text-center">
          <h2 className="font-display text-2xl text-evergreen-deep">
            Had a great experience?
          </h2>
          <p className="mt-2 text-muted">
            Follow Weidner Lawnscape on Instagram and share your yard photos.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={siteConfig.social.instagram}>
              Visit Instagram
            </ButtonLink>
            <ButtonLink href="/request-estimate" variant="secondary">
              Request an Estimate
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
