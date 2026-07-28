import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MobileCtaBar } from "@/components/layout/mobile-cta-bar";
import { PromoBanner } from "@/components/layout/promo-banner";
import { LocalBusinessJsonLd } from "@/components/seo/json-ld";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-24 lg:pb-0">
      <LocalBusinessJsonLd />
      <PromoBanner />
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
      <MobileCtaBar />
    </div>
  );
}
