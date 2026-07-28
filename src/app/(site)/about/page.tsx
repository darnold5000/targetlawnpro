import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";
import { Section, SectionHeading } from "@/components/ui/section";
import { aboutContent } from "@/data/about";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "About Weidner Lawnscape",
  description:
    "Locally owned lawn care and landscaping in Zionsville, founded by Cruz Weidner and trusted by more than 100 homeowners.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Section className="bg-sand/40 pt-16">
        <SectionHeading
          eyebrow="About"
          title={aboutContent.headline}
          description={aboutContent.intro}
        />
      </Section>
      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div className="space-y-5 text-base leading-relaxed text-muted">
            {aboutContent.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <Image
              src="/images/weidner/services/about.webp"
              alt="Outdoor landscaping maintained by Weidner Lawnscape"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Section>
      <Section className="bg-surface">
        <SectionHeading title="Mission & values" description={aboutContent.mission} />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {aboutContent.values.map((value) => (
            <div key={value.title} className="border-t-2 border-leaf pt-4">
              <h3 className="font-display text-xl text-evergreen-deep">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeading
          title="Leadership"
          description={`${siteConfig.owner.name}, ${siteConfig.owner.title} — locally rooted in Zionsville.`}
        />
        <p className="mt-4 max-w-2xl text-sm text-muted">
          Additional named team profiles from the previous website were not independently
          verified and are intentionally omitted here.
        </p>
        <ButtonLink href="/request-estimate" className="mt-8">
          Work with our team
        </ButtonLink>
      </Section>
    </>
  );
}
