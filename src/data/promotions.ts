/**
 * Seasonal / promotional announcements.
 * Only active rows within start/end dates display on the public site.
 * Do not invent promotions — leave empty or mark clearly when owner provides copy.
 */
export type Promotion = {
  id: string;
  headline: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  active: boolean;
};

/** Seed empty until owner supplies a real promotion. */
export const promotions: Promotion[] = [];

export function getActivePromotion(today = new Date()): Promotion | null {
  const iso = today.toISOString().slice(0, 10);
  return (
    promotions.find(
      (p) =>
        p.active &&
        p.startDate <= iso &&
        p.endDate >= iso &&
        p.headline.trim().length > 0,
    ) ?? null
  );
}
