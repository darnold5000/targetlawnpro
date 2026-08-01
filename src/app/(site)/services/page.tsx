import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Section, SectionHeading } from "@/components/ui/section";
import { services } from "@/data/services";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Lawn Care Services",
  description:
    "Lawn mowing, seasonal maintenance, landscape care, and hardscaping in Plainfield, Indiana.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Section className="bg-sand/40 pb-10 pt-16">
        <SectionHeading
          eyebrow="Services"
          title="Everything your yard needs — from weekly mows to outdoor living"
          description="Choose a service to learn what’s included, or request an estimate and we’ll help you prioritize."
        />
        <div className="mt-8">
          <ButtonLink href="/request-estimate">Request a Free Estimate</ButtonLink>
        </div>
      </Section>
      <Section className="pt-10">
        <div className="grid gap-8">
          {services.map((service) => (
            <article
              key={service.slug}
              className="grid overflow-hidden rounded-xl border border-border bg-surface md:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="relative min-h-56">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-2xl text-evergreen-deep sm:text-3xl">
                    {service.name}
                  </h2>
                  {service.status === "coming_soon" ? (
                    <span className="rounded-md bg-sand px-2 py-1 text-xs font-semibold text-evergreen">
                      {service.statusNote ?? "Coming soon"}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {service.shortSummary}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-leaf"
                >
                  View service details
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
