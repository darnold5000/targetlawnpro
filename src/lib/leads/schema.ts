import { z } from "zod";
import { isValidEmail, isValidUsPhone } from "@/lib/forms/validation";

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "estimate_scheduled",
  "estimate_in_progress",
  "estimate_sent",
  "approved",
  "declined",
  "converted_to_job",
  "lost",
  "archived",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  estimate_scheduled: "Estimate Scheduled",
  estimate_in_progress: "Estimate In Progress",
  estimate_sent: "Estimate Sent",
  approved: "Approved",
  declined: "Declined",
  converted_to_job: "Converted to Job",
  lost: "Lost",
  archived: "Archived",
};

export const estimateRequestSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z
    .string()
    .trim()
    .refine(isValidEmail, "Enter a valid email"),
  phone: z
    .string()
    .trim()
    .refine(isValidUsPhone, "Enter a valid phone number"),
  preferredContact: z.enum(["phone", "text", "email"]).optional(),
  address: z.string().trim().min(1, "Property address is required").max(200),
  city: z.string().trim().min(1, "City is required").max(80),
  zip: z.string().trim().min(5, "ZIP is required").max(15),
  serviceType: z.string().trim().min(1, "Select a service").max(80),
  projectDescription: z.string().trim().max(4000).optional(),
  timeline: z.string().trim().max(120).optional(),
  serviceFrequency: z.enum(["one_time", "recurring"]).optional(),
  propertyType: z.string().trim().max(80).optional(),
  budgetRange: z.string().trim().max(80).optional(),
  referralSource: z.string().trim().max(120).optional(),
  preferredEstimateDate: z.string().trim().max(40).optional(),
  preferredTimeWindow: z.string().trim().max(80).optional(),
  estimateType: z.enum(["onsite", "virtual"]).optional(),
  consentContact: z
    .boolean()
    .refine((v) => v === true, "Consent to be contacted is required"),
  consentSms: z.boolean().optional(),
  outsideServiceArea: z.boolean().optional(),
  website: z.string().max(0).optional(), // honeypot
  utmSource: z.string().max(200).optional().nullable(),
  utmMedium: z.string().max(200).optional().nullable(),
  utmCampaign: z.string().max(200).optional().nullable(),
  utmTerm: z.string().max(200).optional().nullable(),
  utmContent: z.string().max(200).optional().nullable(),
  referrer: z.string().max(500).optional().nullable(),
  landingPage: z.string().max(500).optional().nullable(),
  photoPaths: z
    .array(
      z.object({
        path: z.string().min(1).max(500),
        fileName: z.string().max(255).optional(),
        contentType: z.string().max(100).optional(),
        sizeBytes: z.number().int().positive().max(10_000_000).optional(),
      }),
    )
    .max(8)
    .optional(),
});

export type EstimateRequestInput = z.infer<typeof estimateRequestSchema>;

export const contactRequestSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().refine(isValidEmail, "Enter a valid email"),
  phone: z.string().trim().refine(isValidUsPhone, "Enter a valid phone number"),
  message: z.string().trim().min(1, "Message is required").max(4000),
  website: z.string().max(0).optional(),
  consentContact: z
    .boolean()
    .refine((v) => v === true, "Consent to be contacted is required"),
});

export type ContactRequestInput = z.infer<typeof contactRequestSchema>;
