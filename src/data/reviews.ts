export type Review = {
  id: string;
  name: string;
  locationLabel: string;
  body: string;
  featured: boolean;
};

/** Verified testimonials published on weidnerlawnscape.com. Do not invent reviews. */
export const reviews: Review[] = [
  {
    id: "jean-pierre-huber",
    name: "Jean Pierre Huber",
    locationLabel: "Homeowner",
    body: "Weidner Lawnscape does a wonderful job with our landscaping and lawn care. You don’t have to worry about a thing with Cruz and his team. We can finally enjoy the yard instead of working on it.",
    featured: true,
  },
  {
    id: "erika-sauer",
    name: "Erika Sauer",
    locationLabel: "Homeowner",
    body: "We’ve been using Weidner Lawnscape for 3 or 4 years now. Fantastic service and communication. The crew is thorough and careful with their work and provides excellent customer service.",
    featured: true,
  },
  {
    id: "danny-gerald",
    name: "Danny Gerald",
    locationLabel: "Homeowner",
    body: "Very prompt and professional lawn service.",
    featured: true,
  },
];
