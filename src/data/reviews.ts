import { imageAssets } from "@/config/assets";

export type Review = {
  id: string;
  name: string;
  locationLabel: string;
  body: string;
  featured: boolean;
};

/**
 * No named customer testimonials were available from the public Google listing.
 * Do not invent reviews — use googleBusiness summary on the reviews page instead.
 */
export const reviews: Review[] = [];
