import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { Section, SectionHeading } from "@/components/ui/section";
import { getServiceBySlug, services } from "@/data/services";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return createPageMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
    image: service.image,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = service.relatedSlugs
    .map((relatedSlug) => getServiceBySlug(relatedSlug))
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.name,
      telephone: siteConfig.phoneDisplay,
      areaServed: siteConfig.serviceArea.primary,
    },
    areaServed: siteConfig.serviceArea.primary,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section className="pb-8 pt-12">
        <p className="text-sm">
          <Link href="/services" className="text-muted hover:text-evergreen">
            Services
          </Link>
          <span className="mx-2 text-muted">/</span>
          <span className="text-evergreen">{service.name}</span>
        </p>
        <div className="mt-6 grid items-start gap-10 lg:grid-cols-2">
          <div>
            {service.status === "coming_soon" ? (
              <p className="mb-3 inline-flex rounded-md bg-sand px-2 py-1 text-xs font-semibold text-evergreen">
                {service.statusNote}
              </p>
            ) : null}
            <h1 className="font-display text-4xl text-evergreen-deep sm:text-5xl">
              {service.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {service.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/request-estimate">Request a Free Estimate</ButtonLink>
              <ButtonLink href={siteConfig.phoneHref} variant="secondary">
                Call {siteConfig.phoneDisplay}
              </ButtonLink>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading title="What’s included" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {service.includes.map((item) => (
            <div key={item.title} className="border-l-2 border-leaf pl-4">
              <h2 className="font-semibold text-evergreen">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading title="Benefits" />
            <ul className="mt-6 space-y-3">
              {service.benefits.map((benefit) => (
                <li key={benefit} className="text-muted">
                  • {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading title="Our process" />
            <ol className="mt-6 space-y-4">
              {service.process.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-leaf-soft text-sm font-semibold text-evergreen">
                    {i + 1}
                  </span>
                  <span className="text-muted">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section className="bg-leaf-soft">
        <SectionHeading
          title={`Serving ${siteConfig.serviceArea.summary}`}
          description="If you’re outside our usual coverage, still send a request — we’ll flag it for manual review."
        />
        <div className="mt-6">
          <ButtonLink href="/service-area" variant="secondary">
            View service area
          </ButtonLink>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section>
          <SectionHeading title="Related services" />
          <div className="mt-6 flex flex-wrap gap-3">
            {related.map((item) =>
              item ? (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-evergreen hover:bg-leaf-soft"
                >
                  {item.name}
                </Link>
              ) : null,
            )}
          </div>
        </Section>
      ) : null}

      <Section className="bg-evergreen-deep text-white">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl">
            Interested in {service.name.toLowerCase()}?
          </h2>
          <p className="mt-3 text-sand/85">
            Request a free estimate and we’ll follow up about next steps.
          </p>
          <ButtonLink href="/request-estimate" className="mt-6">
            Request a Free Estimate
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
