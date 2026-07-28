import Link from "next/link";
import { siteConfig } from "@/config/site";

export default async function AccessDisabledPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-16">
      <h1 className="font-display text-3xl text-evergreen-deep">Access unavailable</h1>
      <p className="mt-4 text-muted">
        Your login is valid for Signal Works Auth, but this account is not
        provisioned for {siteConfig.name} staff tools
        {reason ? ` (${reason})` : ""}.
      </p>
      <p className="mt-3 text-sm text-muted">
        An owner must create an active <code>weidner_staff_profiles</code> row
        for this tenant before you can use admin.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/login" className="font-semibold text-evergreen underline">
          Back to login
        </Link>
        <Link href="/" className="text-muted underline">
          Public site
        </Link>
      </div>
    </div>
  );
}
