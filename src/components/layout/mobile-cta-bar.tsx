import Link from "next/link";
import { Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <a
          href={siteConfig.phoneHref}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-evergreen px-3 py-3 text-sm font-semibold text-evergreen"
        >
          <Phone className="size-4" aria-hidden />
          Call Now
        </a>
        <Link
          href="/request-estimate"
          className="inline-flex flex-[1.4] items-center justify-center rounded-md bg-accent px-3 py-3 text-sm font-semibold text-white"
        >
          Free Estimate
        </Link>
      </div>
    </div>
  );
}
