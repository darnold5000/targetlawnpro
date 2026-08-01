import { imageAssets } from "@/config/assets";

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  category: "lawn" | "landscape" | "hardscape" | "maintenance";
};

/**
 * Placeholder project photos until Target Lawn Pro Google Business images are
 * exported and added to public/images/target-lawn-pro/gallery/.
 */
const galleryIds = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
] as const;

export const galleryImages: GalleryImage[] = galleryIds.map((id, index) => ({
  id,
  src: imageAssets.gallery(id),
  alt: `Lawn and landscape work photo ${index + 1}`,
  category:
    index % 4 === 0
      ? "lawn"
      : index % 4 === 1
        ? "landscape"
        : index % 4 === 2
          ? "maintenance"
          : "hardscape",
}));

export const featuredGallery = galleryImages.slice(0, 6);
