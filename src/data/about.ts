export const aboutContent = {
  headline: "Local lawn care for Zionsville homeowners",
  intro:
    "Weidner Lawnscape is a locally owned lawn care and landscaping company proudly serving the Zionsville community. Trusted by more than 100 homeowners, we’re dedicated to delivering reliable service, exceptional care, and results that make your outdoor spaces look their best.",
  story: [
    "Founded by Cruz Weidner, a lifelong Zionsville resident, the company began as a passion project and has grown into a trusted local business. Cruz has called Zionsville home for 17 years and brings energy and dedication to every job.",
    "In 2025, he was recognized as the #1 student entrepreneur in the state of Indiana for his leadership in running Weidner Lawnscape.",
    "As a young entrepreneur with a strong commitment to quality, Cruz continues to lead his team with the same values that started it all: hard work, attention to detail, and genuine care for every customer’s lawn.",
    "The company is backed by a skilled crew of five hardworking team members who help keep the community’s lawns looking their best.",
  ],
  mission:
    "At Weidner Lawnscape, we are committed to delivering top-quality lawn care and landscape enhancements that bring your outdoor vision to life. Our team values professionalism, customer satisfaction, and attention to detail, ensuring your yard looks its absolute best.",
  values: [
    {
      title: "Professionalism",
      description: "Reliable crews, clear communication, and careful work on every visit.",
    },
    {
      title: "Customer satisfaction",
      description: "We focus on results homeowners can enjoy without worrying about the yard.",
    },
    {
      title: "Attention to detail",
      description: "From crisp edges to finished beds, the small things matter.",
    },
  ],
} as const;

/**
 * The existing About page lists placeholder team profiles (John Weidner, Sarah Green,
 * Michael Davis, Emily Carter) that read as fabricated stock bios. Do not publish them.
 * Only Cruz Weidner is verified from the live site narrative.
 */
export const teamNotes = {
  verified: [{ name: "Cruz Weidner", title: "Owner" }],
  unpublishedPlaceholders:
    "Additional named team bios from the old site were not verified and are omitted.",
} as const;
