export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  category: "lawn" | "landscape" | "hardscape" | "maintenance";
};

/**
 * Real project photos downloaded from the existing Weidner Lawnscape gallery.
 * Captions are generic because the source gallery did not publish project titles.
 */
export const galleryImages: GalleryImage[] = [
  { id: "01", src: "/images/weidner/gallery/project-01.webp", alt: "Completed Weidner Lawnscape project", category: "landscape" },
  { id: "02", src: "/images/weidner/gallery/project-02.webp", alt: "Completed Weidner Lawnscape project", category: "lawn" },
  { id: "03", src: "/images/weidner/gallery/project-03.webp", alt: "Completed Weidner Lawnscape project", category: "landscape" },
  { id: "04", src: "/images/weidner/gallery/project-04.webp", alt: "Completed Weidner Lawnscape project", category: "hardscape" },
  { id: "05", src: "/images/weidner/gallery/project-05.webp", alt: "Completed Weidner Lawnscape project", category: "landscape" },
  { id: "06", src: "/images/weidner/gallery/project-06.webp", alt: "Completed Weidner Lawnscape project", category: "maintenance" },
  { id: "07", src: "/images/weidner/gallery/project-07.webp", alt: "Completed Weidner Lawnscape project", category: "landscape" },
  { id: "08", src: "/images/weidner/gallery/project-08.webp", alt: "Completed Weidner Lawnscape project", category: "lawn" },
  { id: "09", src: "/images/weidner/gallery/project-09.webp", alt: "Completed Weidner Lawnscape project", category: "landscape" },
  { id: "10", src: "/images/weidner/gallery/project-10.webp", alt: "Completed Weidner Lawnscape project", category: "hardscape" },
  { id: "11", src: "/images/weidner/gallery/project-11.webp", alt: "Completed Weidner Lawnscape project", category: "lawn" },
  { id: "12", src: "/images/weidner/gallery/project-12.webp", alt: "Completed Weidner Lawnscape project", category: "landscape" },
  { id: "13", src: "/images/weidner/gallery/project-13.webp", alt: "Completed Weidner Lawnscape project", category: "maintenance" },
  { id: "14", src: "/images/weidner/gallery/project-14.webp", alt: "Completed Weidner Lawnscape project", category: "lawn" },
  { id: "15", src: "/images/weidner/gallery/project-15.webp", alt: "Completed Weidner Lawnscape project", category: "landscape" },
  { id: "16", src: "/images/weidner/gallery/project-16.webp", alt: "Completed Weidner Lawnscape project", category: "hardscape" },
  { id: "17", src: "/images/weidner/gallery/project-17.webp", alt: "Completed Weidner Lawnscape project", category: "landscape" },
  { id: "18", src: "/images/weidner/gallery/project-18.webp", alt: "Completed Weidner Lawnscape project", category: "lawn" },
  { id: "19", src: "/images/weidner/gallery/project-19.webp", alt: "Completed Weidner Lawnscape project", category: "maintenance" },
  { id: "20", src: "/images/weidner/gallery/project-20.webp", alt: "Completed Weidner Lawnscape project", category: "landscape" },
  { id: "21", src: "/images/weidner/gallery/project-21.webp", alt: "Completed Weidner Lawnscape project", category: "lawn" },
  { id: "22", src: "/images/weidner/gallery/project-22.webp", alt: "Completed Weidner Lawnscape project", category: "hardscape" },
  { id: "23", src: "/images/weidner/gallery/project-23.webp", alt: "Completed Weidner Lawnscape project", category: "landscape" },
  { id: "24", src: "/images/weidner/gallery/project-24.webp", alt: "Completed Weidner Lawnscape project", category: "lawn" },
  { id: "25", src: "/images/weidner/gallery/project-25.webp", alt: "Completed Weidner Lawnscape project", category: "maintenance" },
  { id: "26", src: "/images/weidner/gallery/project-26.webp", alt: "Completed Weidner Lawnscape project", category: "landscape" },
];

export const featuredGallery = galleryImages.slice(0, 6);
