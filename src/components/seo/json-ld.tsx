import { imageAssets } from "@/config/assets";
import { siteConfig } from "@/config/site";

export function LocalBusinessJsonLd() {
  const sameAs = [siteConfig.social.instagram, siteConfig.social.googleMaps].filter(
    (url): url is string => Boolean(url),
  );

  const data = {
    "@context": "https://schema.org",
    "@type": "LawnCareService",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    telephone: siteConfig.phoneDisplay,
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
    areaServed: {
      "@type": "City",
      name: siteConfig.serviceArea.primary,
      containedInPlace: {
        "@type": "State",
        name: "Indiana",
      },
    },
    image: `${siteConfig.siteUrl}${imageAssets.shareOg}`,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
