import Link from "next/link";
import { getActivePromotion } from "@/data/promotions";

export function PromoBanner() {
  const promo = getActivePromotion();
  if (!promo) return null;

  return (
    <div className="bg-leaf text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-semibold">{promo.headline}</span>
          {promo.description ? (
            <span className="text-white/90"> — {promo.description}</span>
          ) : null}
        </p>
        <Link
          href={promo.ctaHref}
          className="shrink-0 font-semibold underline-offset-2 hover:underline"
        >
          {promo.ctaLabel}
        </Link>
      </div>
    </div>
  );
}
