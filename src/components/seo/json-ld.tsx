import { siteConfig } from "@/config/site";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LawnCareService",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    telephone: siteConfig.phoneDisplay,
    email: siteConfig.email,
    areaServed: {
      "@type": "City",
      name: siteConfig.serviceArea.primary,
      containedInPlace: {
        "@type": "State",
        name: "Indiana",
      },
    },
    image: `${siteConfig.siteUrl}/images/weidner/hero/hero-main.webp`,
    sameAs: [siteConfig.social.instagram],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
