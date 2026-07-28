import Link from "next/link";
import { requireStaff } from "@/lib/auth/access";
import { siteConfig } from "@/config/site";
import { SignOutButton } from "@/components/admin/sign-out-button";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/estimates", label: "Estimates" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/recurring", label: "Recurring" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireStaff();

  return (
    <div className="min-h-screen bg-sand/30">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-leaf uppercase">
              {siteConfig.name}
            </p>
            <p className="font-display text-lg text-evergreen-deep">Operations</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted sm:inline">{profile.fullName}</span>
            <Link href="/" className="text-muted hover:text-evergreen">
              View site
            </Link>
            <SignOutButton />
          </div>
        </div>
        <nav
          className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3"
          aria-label="Admin"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap text-evergreen hover:bg-leaf-soft"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
