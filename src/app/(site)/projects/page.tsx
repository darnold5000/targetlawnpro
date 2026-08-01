import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";
import { Section, SectionHeading } from "@/components/ui/section";
import { galleryImages } from "@/data/gallery";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Project Gallery",
  description:
    "Lawn care and landscaping project photos from Target Lawn Pro in Plainfield and nearby areas.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <Section className="bg-sand/40 pb-8 pt-16">
        <SectionHeading
          eyebrow="Projects"
          title="Work that speaks for itself"
          description="Gallery placeholders are shown until Target Lawn Pro Google Business photos are added. Request an estimate to see what we can do for your property."
        />
      </Section>
      <Section className="pt-8">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {galleryImages.map((image) => (
            <figure
              key={image.id}
              className="mb-4 break-inside-avoid overflow-hidden rounded-lg bg-surface"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={900}
                height={1100}
                className="h-auto w-full object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </figure>
          ))}
        </div>
        <div className="mt-12 rounded-xl bg-evergreen px-6 py-10 text-center text-white">
          <h2 className="font-display text-2xl sm:text-3xl">
            Want results like these at your home?
          </h2>
          <ButtonLink href="/request-estimate" className="mt-6">
            Request a Free Estimate
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
