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
      "Reliable weekly lawn mowing in Zionsville that keeps your grass healthy, trimmed, and looking sharp all season long.",
    description:
      "Looking for reliable and professional lawn mowing in Zionsville? At Weidner Lawnscape, we provide consistent, high-quality mowing services that keep your yard looking healthy, clean, and beautifully maintained. Our local team knows what Zionsville lawns need to thrive — and we deliver dependable care week after week.",
    benefits: [
      "Local experts with lawn care experience in Zionsville",
      "Reliable weekly scheduling you can trust",
      "Professional equipment for a consistent, clean cut",
      "Dedicated to keeping your yard looking its best all season long",
    ],
    process: [
      "Tell us about your property and preferred schedule",
      "We confirm service details and timing",
      "Our crew mows, trims, edges, and cleans up each visit",
    ],
    includes: [
      {
        title: "Mowing",
        description:
          "Even, professional cuts that encourage thicker and greener grass.",
      },
      {
        title: "Trimming",
        description:
          "Careful detail work around trees, fences, flower beds, and other edges.",
      },
      {
        title: "Edging",
        description:
          "Crisp lines along sidewalks, driveways, and walkways for a polished finish.",
      },
      {
        title: "Debris Cleanup",
        description:
          "Complete blowing of grass clippings and debris to leave your yard spotless.",
      },
    ],
    image: "/images/weidner/services/mowing.webp",
    imageAlt: "Freshly mowed residential lawn",
    status: "active",
    seoTitle: "Lawn Mowing in Zionsville | Weidner Lawnscape",
    seoDescription:
      "Weekly lawn mowing, trimming, edging, and cleanup for homeowners in Zionsville and surrounding areas.",
    relatedSlugs: ["yearly-maintenance", "fertilization-chemicals"],
  },
  {
    slug: "yearly-maintenance",
    name: "Yearly Maintenance",
    shortSummary:
      "Seasonal cleanups, mulch, aeration, overseeding, and fall leaf removal — everything your yard needs year-round.",
    description:
      "Keeping your yard looking its best year-round takes consistent care. At Weidner Lawnscape, we provide professional yearly maintenance services in Zionsville to keep your lawn and landscape healthy, tidy, and beautiful in every season. From spring cleanups to fall leaf removal, we make sure your outdoor space is always ready to enjoy.",
    benefits: [
      "Full-service care designed for every season",
      "Reliable, on-time scheduling to keep your yard in top shape",
      "Local expertise and knowledge of Zionsville landscapes",
      "Professional team focused on quality and attention to detail",
    ],
    process: [
      "Share your seasonal priorities and property details",
      "We recommend a maintenance plan for the year",
      "Seasonal visits keep beds, lawn, and leaves under control",
    ],
    includes: [
      {
        title: "Spring Clean-Up",
        description:
          "Clearing out garden beds, trimming and pruning shrubs, and preparing your landscape for the season ahead.",
      },
      {
        title: "Mulch Installation",
        description:
          "Fresh mulch in spring or summer to enhance curb appeal, improve soil health, and make your landscape shine.",
      },
      {
        title: "Seasonal Maintenance",
        description:
          "Regular weeding, edging garden beds, and tidying your yard to keep it looking polished all season long.",
      },
      {
        title: "Core Aeration & Overseeding",
        description:
          "Revitalize your lawn in the fall by filling in bare spots and strengthening turf for thicker, healthier grass.",
      },
      {
        title: "Fall Leaf Clean-Up",
        description:
          "Collecting and moving leaves to the curb for town pick-up, along with final touches to wrap up your landscape for the year.",
      },
    ],
    image: "/images/weidner/services/maintenance.webp",
    imageAlt: "Seasonal landscape maintenance work",
    status: "active",
    seoTitle: "Yearly Landscape Maintenance in Zionsville | Weidner Lawnscape",
    seoDescription:
      "Spring cleanup, mulch, aeration, overseeding, and fall leaf removal for Zionsville homeowners.",
    relatedSlugs: ["lawn-mowing", "design-installations"],
  },
  {
    slug: "design-installations",
    name: "Design & Installations",
    shortSummary:
      "Professional landscape design, planting, mulch, and lighting that bring your outdoor vision to life.",
    description:
      "Ready to bring new life to your yard with a custom landscape design? At Weidner Lawnscape, we specialize in professional landscape design and installations in Zionsville that transform ordinary yards into beautiful, functional outdoor spaces. Whether you’re starting from scratch or refreshing an existing landscape, our team will create a design that fits your property, style, and lifestyle.",
    benefits: [
      "Locally owned with deep knowledge of Zionsville landscapes",
      "Custom designs tailored to your property and preferences",
      "Professional installations that boost curb appeal and property value",
      "A detail-oriented team dedicated to bringing your vision to life",
    ],
    process: [
      "Consultation to understand your style and goals",
      "Design and material recommendations for your property",
      "Professional installation with finishing details",
    ],
    includes: [
      {
        title: "Landscape Layout & Design",
        description:
          "Thoughtful planning to create a balanced, eye-catching outdoor space.",
      },
      {
        title: "Planting Shrubs and Perennials",
        description: "Add color, texture, and year-round beauty to your yard.",
      },
      {
        title: "Mulch Installation",
        description:
          "Enhance curb appeal while protecting and nourishing your plants.",
      },
      {
        title: "Landscape Lighting",
        description:
          "Highlight key features, improve safety, and enjoy your outdoor space at night.",
      },
      {
        title: "Larger Projects",
        description:
          "From complete outdoor makeovers to custom features, we handle it all.",
      },
    ],
    image: "/images/weidner/services/design.webp",
    imageAlt: "Landscape planting and design work",
    status: "active",
    seoTitle: "Landscape Design & Installation in Zionsville | Weidner Lawnscape",
    seoDescription:
      "Custom landscape design, planting, mulch, and lighting for Zionsville homes.",
    relatedSlugs: ["hardscaping", "yearly-maintenance"],
  },
  {
    slug: "hardscaping",
    name: "Hardscaping",
    shortSummary:
      "Custom patios, walkways, and retaining walls that add beauty, function, and value outdoors.",
    description:
      "Looking to upgrade your outdoor living space with professional hardscaping in Zionsville? At Weidner Lawnscape, we design and build custom hardscapes that are as durable as they are beautiful. From patios and walkways to retaining walls and more, our team creates outdoor features that add style, function, and long-lasting value to your property.",
    benefits: [
      "Expert craftsmanship and attention to detail",
      "Locally owned and operated with a focus on the Zionsville community",
      "Custom designs that match your lifestyle and property",
      "A professional, dependable team dedicated to customer satisfaction",
    ],
    process: [
      "Discuss how you want to use your outdoor space",
      "We plan materials, layout, and scope",
      "Build and finish durable hardscape features",
    ],
    includes: [
      {
        title: "Paver Patios",
        description: "Perfect for outdoor dining, entertaining, and relaxing.",
      },
      {
        title: "Paver Walkways",
        description:
          "Elegant paths that improve curb appeal and connect your outdoor spaces.",
      },
      {
        title: "Retaining Walls",
        description:
          "Built to last while adding structure, beauty, and functionality.",
      },
      {
        title: "Additional Features",
        description:
          "Fire pits, outdoor living spaces, and other features tailored to your vision.",
      },
    ],
    image: "/images/weidner/services/hardscape.webp",
    imageAlt: "Hardscaping patio and outdoor living space",
    status: "active",
    seoTitle: "Hardscaping in Zionsville | Weidner Lawnscape",
    seoDescription:
      "Paver patios, walkways, retaining walls, and outdoor living features in Zionsville.",
    relatedSlugs: ["design-installations", "yearly-maintenance"],
  },
  {
    slug: "fertilization-chemicals",
    name: "Fertilization & Weed Control",
    shortSummary:
      "A six-step lawn fertilization and weed control program for a lush, green yard — launching in 2026.",
    description:
      "Our six-step lawn fertilization and weed control program is designed to deliver a lush, green yard in Zionsville. This service is launching in 2026. Request an estimate today if you’d like to be contacted when enrollment opens.",
    benefits: [
      "Program designed for healthier, greener turf",
      "Local care focused on Zionsville lawns",
      "Ask to be notified when the 2026 program opens",
    ],
    process: [
      "Share your lawn goals and property details",
      "We’ll note your interest for the 2026 program launch",
      "We’ll follow up when fertilization service enrollment opens",
    ],
    includes: [
      {
        title: "Six-Step Program",
        description:
          "A planned fertilization and weed control schedule for the growing season (details confirmed at launch).",
      },
    ],
    image: "/images/weidner/services/maintenance.webp",
    imageAlt: "Healthy green lawn ready for fertilization program",
    status: "coming_soon",
    statusNote: "Launching 2026",
    seoTitle: "Lawn Fertilization Coming 2026 | Weidner Lawnscape",
    seoDescription:
      "Weidner Lawnscape’s six-step fertilization and weed control program for Zionsville lawns launches in 2026.",
    relatedSlugs: ["lawn-mowing", "yearly-maintenance"],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getActiveServices(): Service[] {
  return services.filter((s) => s.status === "active");
}
