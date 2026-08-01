/** Public image paths for Target Lawn Pro marketing assets. */
export const imageAssets = {
  hero: "/images/target-lawn-pro/hero/hero-sunlit-park.webp",
  about: "/images/target-lawn-pro/services/about.webp",
  logoIcon: "/images/target-lawn-pro/logo/logo-icon.webp",
  services: {
    mowing: "/images/target-lawn-pro/services/mowing.webp",
    maintenance: "/images/target-lawn-pro/services/maintenance.webp",
    design: "/images/target-lawn-pro/services/design.webp",
    hardscape: "/images/target-lawn-pro/services/hardscape.webp",
  },
  gallery: (id: string) =>
    `/images/target-lawn-pro/gallery/project-${id}.webp`,
} as const;
