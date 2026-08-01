import { siteConfig } from "@/config/site";

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: "What areas do you serve?",
    answer: `Target Lawn Pro is based in Plainfield and serves Plainfield and surrounding areas. Submit an estimate request and we’ll confirm whether we can serve your address.`,
  },
  {
    question: "How do I request an estimate?",
    answer: `Use the Request a Free Estimate form on this site, or call/text ${siteConfig.phoneDisplay}. Include your address, the services you’re interested in, and any helpful photos of the property.`,
  },
  {
    question: "What services do you offer?",
    answer:
      "We offer lawn mowing, seasonal maintenance, landscape care, and hardscaping. Tell us what you need on the estimate form and we’ll confirm scope and availability.",
  },
  {
    question: "How quickly will you respond?",
    answer: siteConfig.responseTime,
  },
  {
    question: "Do you offer weekly mowing?",
    answer:
      "Yes. Weekly mowing can include mowing, trimming, edging, and cleanup so your yard stays consistent through the season.",
  },
  {
    question: "What are your hours?",
    answer:
      "Our Google listing shows we open at 9 AM on Mondays. Other days are by appointment — call or request an estimate to schedule.",
  },
];
