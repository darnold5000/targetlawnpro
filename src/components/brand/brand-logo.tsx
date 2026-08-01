import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type BrandLogoProps = {
  className?: string;
  /** Light text for dark backgrounds (footer). */
  variant?: "default" | "on-dark";
};

export function BrandLogo({ className, variant = "default" }: BrandLogoProps) {
  const onDark = variant === "on-dark";

  return (
    <span
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label={siteConfig.name}
    >
      <span
        className={cn(
          "relative flex size-9 shrink-0 items-center justify-center rounded-full border-[3px]",
          onDark
            ? "border-white bg-white/10"
            : "border-target-red bg-leaf-soft",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute size-4 rounded-full border-2",
            onDark ? "border-white" : "border-target-red",
          )}
        />
        <span
          className={cn(
            "size-1.5 rounded-full",
            onDark ? "bg-white" : "bg-target-red",
          )}
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-base font-semibold tracking-wide uppercase sm:text-lg",
            onDark ? "text-white" : "text-evergreen-deep",
          )}
        >
          Target Lawn
        </span>
        <span
          className={cn(
            "mt-0.5 text-[0.65rem] font-semibold tracking-[0.22em] uppercase sm:text-xs",
            onDark ? "text-sand/90" : "text-leaf",
          )}
        >
          Pro
        </span>
      </span>
    </span>
  );
}
