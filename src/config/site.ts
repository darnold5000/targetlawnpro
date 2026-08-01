function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "https://targetlawnpro.com";
}

export const siteConfig = {
  name: "Target Lawn Pro",
  legalName: "Target Lawn Pro LLC",
  tagline: "Your partner to make your lawn look its best",
  description:
    "Target Lawn Pro provides lawn care services for homeowners in Plainfield, Indiana and nearby communities.",
  siteUrl: resolveSiteUrl(),
  phoneDisplay: "317-260-7032",
  phoneHref: "tel:3172607032",
  smsHref: "sms:3172607032",
  /** Not listed on the public Google Business Profile — contact via phone or form. */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "",
  serviceArea: {
    primary: "Plainfield",
    summary: "Plainfield & surrounding areas",
    cities: ["Plainfield"] as string[],
    note: "We are based in Plainfield and serve nearby Hendricks County communities. Request an estimate and we will confirm availability for your address.",
  },
  address: {
    city: "Plainfield",
    state: "IN",
    region: "Indiana",
    zip: "46168",
  },
  social: {
    googleMaps: null as string | null,
    instagram: null as string | null,
  },
  googleBusiness: {
    rating: 5.0,
    reviewCount: 1,
    ownerQuote:
      "Target Lawn Pro is your partner to make your lawn look its best!",
  },
  hours: [
    {
      days: "Monday–Friday",
      hours: "Opens 9 AM",
    },
    {
      days: "Saturday–Sunday",
      hours: "By appointment",
    },
  ],
  responseTime:
    "We typically respond to estimate requests within one business day.",
  developer: {
    name: "Signal Works",
    platformLabel: "Signal Works Platform",
    url: "https://hiresignalworks.com",
  },
} as const;

export const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/service-area", label: "Service Area" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

/** When true, allow search indexing. Default false for staging/demo. */
export function allowIndexing(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
}
