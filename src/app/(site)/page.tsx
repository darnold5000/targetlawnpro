import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, Phone, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Section, SectionHeading } from "@/components/ui/section";
import { imageAssets } from "@/config/assets";
import { siteConfig } from "@/config/site";
import { aboutContent } from "@/data/about";
import { faqs } from "@/data/faqs";
import { featuredGallery } from "@/data/gallery";
import { getActiveServices } from "@/data/services";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: `${siteConfig.name} | Lawn Care in Plainfield, IN`,
  description: siteConfig.description,
  path: "/",
});

const processSteps = [
  {
    title: "Consultation",
    description:
      "Tell us about your lawn, schedule, and what you want improved on the property.",
  },
  {
    title: "Service plan",
    description:
      "We confirm scope, timing, and pricing so you know exactly what to expect.",
  },
  {
    title: "Results",
    description:
      "Our crew handles the work and leaves your yard looking its best.",
  },
];

export default function HomePage() {
  const services = getActiveServices();
  const { googleBusiness } = siteConfig;

  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden bg-evergreen-deep text-white">
        <Image
          src={imageAssets.hero}
          alt="Sunlit green lawn with mature trees"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-evergreen-deep/88 via-evergreen-deep/62 to-evergreen-deep/20" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20">
          <p className="animate-fade-up text-sm font-semibold tracking-[0.18em] text-sand/90 uppercase">
            {siteConfig.name}
          </p>
          <h1 className="animate-fade-up-delay mt-4 max-w-3xl font-display text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
            Lawn care in Plainfield you can count on
          </h1>
          <p className="animate-fade-up-delay-2 mt-5 max-w-xl text-base leading-relaxed text-sand/90 sm:text-lg">
            {siteConfig.tagline}. Weekly mowing, seasonal maintenance, and landscape
            care from a local Plainfield crew.
          </p>
          <div className="animate-fade-up-delay-2 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/request-estimate" className="bg-accent hover:bg-accent-hover">
              Request a Free Estimate
            </ButtonLink>
            <ButtonLink
              href={siteConfig.phoneHref}
              variant="secondary"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <Phone className="mr-2 size-4" aria-hidden />
              Call {siteConfig.phoneDisplay}
            </ButtonLink>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-sm text-sand/85">
            <MapPin className="size-4" aria-hidden />
            Serving {siteConfig.serviceArea.summary}
          </p>
        </div>
      </section>

      <Section className="bg-surface py-10 sm:py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            `${googleBusiness.rating.toFixed(1)}★ on Google`,
            "Plainfield-based lawn care",
            "Clear communication every step",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-leaf" aria-hidden />
              <p className="text-sm font-medium text-evergreen sm:text-base">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Services"
          title="Lawn care built for local homes"
          description="Practical services for weekly upkeep, seasonal yard work, and outdoor improvements."
        />
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {services.map((service) => (
            <article key={service.slug} className="group overflow-hidden rounded-xl border border-border bg-surface">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-evergreen-deep">
                  {service.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  {service.shortSummary}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-leaf"
                >
                  Learn more
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-evergreen text-sand">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Why homeowners choose us"
              title="Local service, professional results"
              description={aboutContent.mission}
              theme="on-dark"
            />
            <ul className="mt-8 space-y-4">
              {aboutContent.values.map((value) => (
                <li key={value.title} className="border-l-2 border-leaf-soft pl-4">
                  <p className="font-semibold text-white">{value.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-sand/95">
                    {value.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <Image
              src={imageAssets.about}
              alt="Finished lawn and landscape care"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Projects"
            title="Lawn and landscape work"
            description="Project photos will be updated from the Target Lawn Pro Google listing — gallery placeholders are shown for now."
          />
          <ButtonLink href="/projects" variant="secondary">
            View gallery
          </ButtonLink>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {featuredGallery.map((image) => (
            <div key={image.id} className="relative aspect-[4/5] overflow-hidden rounded-lg bg-sand">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-sand/50">
        <SectionHeading
          eyebrow="Simple process"
          title="What happens after you reach out"
          align="center"
        />
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {processSteps.map((step, index) => (
            <li key={step.title} className="text-center">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-evergreen font-display text-lg text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 font-display text-xl text-evergreen-deep">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Reviews"
          title="What customers are saying"
          description="Public Google Business rating for Target Lawn Pro."
        />
        <div className="mt-10 max-w-2xl rounded-xl border border-border bg-surface p-8">
          <div className="flex items-center gap-2 text-evergreen">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="size-5 fill-accent text-accent" aria-hidden />
            ))}
            <span className="ml-2 font-display text-2xl">
              {googleBusiness.rating.toFixed(1)}
            </span>
            <span className="text-sm text-muted">
              ({googleBusiness.reviewCount} Google review
              {googleBusiness.reviewCount === 1 ? "" : "s"})
            </span>
          </div>
          <blockquote className="mt-6 border-l-4 border-leaf pl-4">
            <p className="text-base leading-relaxed text-foreground">
              “{googleBusiness.ownerQuote}”
            </p>
            <footer className="mt-3 text-sm text-muted">From Target Lawn Pro on Google</footer>
          </blockquote>
        </div>
        <div className="mt-8">
          <ButtonLink href="/reviews" variant="ghost">
            Reviews details
          </ButtonLink>
        </div>
      </Section>

      <Section className="bg-leaf-soft">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <SectionHeading
            eyebrow="Service area"
            title={`Proudly serving ${siteConfig.serviceArea.summary}`}
            description={siteConfig.serviceArea.note}
          />
          <div className="rounded-xl border border-border bg-surface p-6">
            <p className="font-display text-2xl text-evergreen-deep">Plainfield, IN</p>
            <p className="mt-2 text-sm text-muted">
              Nearby addresses are reviewed manually — we won’t silently reject your request.
            </p>
            <ButtonLink href="/service-area" variant="secondary" className="mt-5">
              Check service area
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="FAQ" title="Quick answers before you request an estimate" />
        <div className="mt-8 divide-y divide-border border-y border-border">
          {faqs.slice(0, 4).map((faq) => (
            <details key={faq.question} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold text-evergreen marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="text-leaf transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
        <div className="mt-6">
          <ButtonLink href="/faq" variant="ghost">
            View all FAQs
          </ButtonLink>
        </div>
      </Section>

      <Section className="bg-evergreen-deep text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl sm:text-4xl">
            Ready for a yard you can enjoy?
          </h2>
          <p className="mt-4 text-base text-sand/85 sm:text-lg">
            Tell us about your property and we’ll follow up to schedule an estimate.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/request-estimate">Request a Free Estimate</ButtonLink>
            <ButtonLink
              href={siteConfig.phoneHref}
              variant="secondary"
              className="border-white/25 bg-transparent text-white hover:bg-white/10"
            >
              Call Now
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
