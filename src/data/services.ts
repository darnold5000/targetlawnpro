import { imageAssets } from "@/config/assets";

const brand = "Target Lawn Pro";
const area = "Plainfield";

export type Service = {
  slug: string;
  name: string;
  shortSummary: string;
  description: string;
  benefits: string[];
  process: string[];
  includes: { title: string; description: string }[];
  image: string;
  imageAlt: string;
  status: "active" | "coming_soon";
  statusNote?: string;
  seoTitle: string;
  seoDescription: string;
  relatedSlugs: string[];
};

export const services: Service[] = [
  {
    slug: "lawn-mowing",
    name: "Lawn Mowing",
    shortSummary:
      "Reliable lawn mowing in Plainfield that keeps your grass trimmed, neat, and healthy through the season.",
    description:
      `Looking for dependable lawn mowing in ${area}? ${brand} provides consistent mowing, trimming, edging, and cleanup so your yard stays sharp week after week.`,
    benefits: [
      "Local crew serving Plainfield and nearby neighborhoods",
      "Reliable scheduling you can count on",
      "Professional equipment for a clean, even cut",
      "Trimming and edging for a finished look",
    ],
    process: [
      "Tell us about your property and preferred schedule",
      "We confirm service details and timing",
      "Our crew mows, trims, edges, and cleans up each visit",
    ],
    includes: [
      {
        title: "Mowing",
        description: "Even cuts that keep your turf looking healthy and uniform.",
      },
      {
        title: "Trimming",
        description: "Detail work around beds, fences, trees, and other obstacles.",
      },
      {
        title: "Edging",
        description: "Crisp lines along sidewalks, driveways, and walkways.",
      },
      {
        title: "Cleanup",
        description: "Blowing clippings and debris so the yard is ready to enjoy.",
      },
    ],
    image: imageAssets.services.mowing,
    imageAlt: "Freshly mowed residential lawn",
    status: "active",
    seoTitle: `Lawn Mowing in ${area} | ${brand}`,
    seoDescription: `Weekly lawn mowing, trimming, edging, and cleanup for homeowners in ${area} and nearby areas.`,
    relatedSlugs: ["yearly-maintenance", "landscape-care"],
  },
  {
    slug: "yearly-maintenance",
    name: "Seasonal Maintenance",
    shortSummary:
      "Spring and fall cleanups, mulch, aeration, overseeding, and leaf removal to keep your yard on track year-round.",
    description:
      `${brand} helps ${area} homeowners stay ahead of seasonal yard work — from spring bed cleanups to fall leaf removal — so your landscape stays tidy in every season.`,
    benefits: [
      "Seasonal visits planned around Indiana weather",
      "One team for mowing and seasonal touch-ups",
      "Local knowledge of Plainfield-area properties",
      "Clear communication before each visit",
    ],
    process: [
      "Share your seasonal priorities and property details",
      "We recommend a maintenance plan for the year",
      "Scheduled visits keep beds, lawn, and leaves under control",
    ],
    includes: [
      {
        title: "Spring clean-up",
        description: "Bed clearing, shrub touch-ups, and prep for the growing season.",
      },
      {
        title: "Mulch installation",
        description: "Fresh mulch to tidy beds and support plant health.",
      },
      {
        title: "Seasonal bed care",
        description: "Weeding, edging beds, and keeping the landscape polished.",
      },
      {
        title: "Aeration & overseeding",
        description: "Fall lawn revitalization when your turf needs it most.",
      },
      {
        title: "Fall leaf clean-up",
        description: "Leaf removal and final seasonal tidy-up.",
      },
    ],
    image: imageAssets.services.maintenance,
    imageAlt: "Seasonal landscape maintenance work",
    status: "active",
    seoTitle: `Seasonal Yard Maintenance in ${area} | ${brand}`,
    seoDescription: `Spring cleanup, mulch, aeration, overseeding, and fall leaf removal in ${area}.`,
    relatedSlugs: ["lawn-mowing", "landscape-care"],
  },
  {
    slug: "landscape-care",
    name: "Landscape Care",
    shortSummary:
      "Planting, mulch, bed refreshes, and landscape improvements — ask what we can handle for your property.",
    description:
      `Need more than mowing? ${brand} can discuss landscape planting, mulch, bed refreshes, and other outdoor improvements for ${area} homes. Scope and timing are confirmed during your estimate.`,
    benefits: [
      "Practical upgrades that improve curb appeal",
      "Work planned around your budget and priorities",
      "Same local crew you already trust for mowing",
      "Straight answers about what we can take on",
    ],
    process: [
      "Walk through your goals and property layout",
      "We outline materials, scope, and timing",
      "Installation and finishing with attention to detail",
    ],
    includes: [
      {
        title: "Bed & planting work",
        description: "Shrubs, perennials, and bed refreshes where appropriate.",
      },
      {
        title: "Mulch & edging",
        description: "Clean bed lines and fresh mulch for a finished look.",
      },
      {
        title: "Property-specific projects",
        description: "Larger improvements quoted individually after a site review.",
      },
    ],
    image: imageAssets.services.design,
    imageAlt: "Landscape planting and bed care",
    status: "active",
    seoTitle: `Landscape Care in ${area} | ${brand}`,
    seoDescription: `Landscape planting, mulch, and bed care for homeowners in ${area}.`,
    relatedSlugs: ["yearly-maintenance", "lawn-mowing"],
  },
  {
    slug: "hardscaping",
    name: "Hardscaping",
    shortSummary:
      "Patios, walkways, and retaining walls — contact us to discuss availability for your project.",
    description:
      `For paver patios, walkways, retaining walls, and similar outdoor features, contact ${brand} to discuss whether we can take on your ${area} project and provide a custom quote.`,
    benefits: [
      "Custom outdoor features tailored to your space",
      "Durable materials and careful installation",
      "Local Plainfield-area service",
      "Honest scope review before work begins",
    ],
    process: [
      "Discuss how you want to use your outdoor space",
      "We plan materials, layout, and scope",
      "Build and finish hardscape features to spec",
    ],
    includes: [
      { title: "Paver patios", description: "Outdoor living and entertaining spaces." },
      {
        title: "Walkways",
        description: "Paths that connect your home’s outdoor areas.",
      },
      {
        title: "Retaining walls",
        description: "Functional structure with a clean finished look.",
      },
    ],
    image: imageAssets.services.hardscape,
    imageAlt: "Hardscaping patio and outdoor living space",
    status: "active",
    seoTitle: `Hardscaping in ${area} | ${brand}`,
    seoDescription: `Paver patios, walkways, and retaining walls in ${area} — contact for a project quote.`,
    relatedSlugs: ["landscape-care", "yearly-maintenance"],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getActiveServices(): Service[] {
  return services.filter((s) => s.status === "active");
}
