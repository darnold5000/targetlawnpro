import Link from "next/link";
import { cn } from "@/lib/utils";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const styles = {
    primary:
      "bg-accent text-white hover:bg-accent-hover shadow-sm",
    secondary:
      "border border-evergreen/30 bg-surface text-evergreen hover:bg-leaf-soft",
    ghost: "text-evergreen underline-offset-4 hover:underline",
  }[variant];

  const isExternal = href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("sms:");

  const classNames = cn(
    "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition",
    styles,
    className,
  );

  if (isExternal) {
    return (
      <a href={href} className={classNames}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classNames}>
      {children}
    </Link>
  );
}
