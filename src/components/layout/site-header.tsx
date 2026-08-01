"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { navLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-evergreen transition hover:text-leaf"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={siteConfig.phoneHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-evergreen"
          >
            <Phone className="size-4" aria-hidden />
            {siteConfig.phoneDisplay}
          </a>
          <Link
            href="/request-estimate"
            className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            Request a Free Estimate
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex rounded-md border border-border bg-surface p-2 text-evergreen lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-border bg-surface lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4" aria-label="Mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-3 text-base font-medium text-evergreen hover:bg-leaf-soft"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/request-estimate"
            className="mt-2 rounded-md bg-accent px-3 py-3 text-center text-base font-semibold text-white"
            onClick={() => setOpen(false)}
          >
            Request a Free Estimate
          </Link>
        </nav>
      </div>
    </header>
  );
}
