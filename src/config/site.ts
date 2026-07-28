export const siteConfig = {
  name: "Weidner Lawnscape",
  legalName: "Weidner Lawnscape LLC",
  tagline: "Lawn care & landscaping for Zionsville homeowners",
  description:
    "Reliable lawn mowing, yearly maintenance, landscape design, and hardscaping for homeowners in Zionsville and surrounding areas.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://weidnerlawnscape.com",
  phoneDisplay: "317-205-6256",
  phoneHref: "tel:3172056256",
  smsHref: "sms:3172056256",
  email: "weidnerlawnscapellc@gmail.com",
  serviceArea: {
    primary: "Zionsville",
    summary: "Zionsville & surrounding areas",
    cities: ["Zionsville"] as string[],
    note: "We primarily serve Zionsville and nearby communities. Request an estimate and we will confirm availability for your address.",
  },
  address: {
    // No public street address listed on the existing site — service-area based.
    city: "Zionsville",
    state: "IN",
    region: "Indiana",
  },
  social: {
    instagram: "https://www.instagram.com/weidnerls/",
  },
  owner: {
    name: "Cruz Weidner",
    title: "Owner",
  },
  hours: [
    {
      days: "Monday–Friday",
      hours: "By appointment",
    },
    {
      days: "Saturday",
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
