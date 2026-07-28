import { z } from "zod";

export const ESTIMATE_STATUSES = [
  "draft",
  "sent",
  "approved",
  "declined",
  "expired",
] as const;

export type EstimateStatus = (typeof ESTIMATE_STATUSES)[number];

export const ESTIMATE_STATUS_LABELS: Record<EstimateStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  approved: "Approved",
  declined: "Declined",
  expired: "Expired",
};

export const JOB_STATUSES = [
  "unscheduled",
  "scheduled",
  "confirmed",
  "in_progress",
  "delayed",
  "completed",
  "canceled",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  unscheduled: "Unscheduled",
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  delayed: "Delayed",
  completed: "Completed",
  canceled: "Canceled",
};

export const estimateItemSchema = z.object({
  description: z.string().trim().min(1).max(500),
  quantity: z.coerce.number().positive().max(100000),
  unit: z.string().trim().max(40).optional(),
  rateCents: z.coerce.number().int().min(0).max(10_000_000),
});

export const createEstimateSchema = z.object({
  leadId: z.string().uuid().optional().nullable(),
  customerId: z.string().uuid().optional().nullable(),
  status: z.enum(ESTIMATE_STATUSES).default("draft"),
  notes: z.string().trim().max(4000).optional(),
  terms: z.string().trim().max(4000).optional(),
  expiresAt: z.string().optional().nullable(),
  discountCents: z.coerce.number().int().min(0).default(0),
  taxCents: z.coerce.number().int().min(0).default(0),
  items: z.array(estimateItemSchema).min(1).max(50),
});

export const updateEstimateSchema = z.object({
  status: z.enum(ESTIMATE_STATUSES).optional(),
  notes: z.string().trim().max(4000).optional().nullable(),
  terms: z.string().trim().max(4000).optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  discountCents: z.coerce.number().int().min(0).optional(),
  taxCents: z.coerce.number().int().min(0).optional(),
  items: z.array(estimateItemSchema).min(1).max(50).optional(),
});

export const createJobSchema = z.object({
  customerId: z.string().uuid().optional().nullable(),
  estimateId: z.string().uuid().optional().nullable(),
  leadId: z.string().uuid().optional().nullable(),
  serviceType: z.string().trim().max(120).optional(),
  status: z.enum(JOB_STATUSES).default("unscheduled"),
  scheduledDate: z.string().optional().nullable(),
  arrivalWindow: z.string().trim().max(120).optional().nullable(),
  instructions: z.string().trim().max(4000).optional().nullable(),
  internalNotes: z.string().trim().max(4000).optional().nullable(),
});

export const updateJobSchema = createJobSchema.partial();

export const createRecurringSchema = z.object({
  customerId: z.string().uuid(),
  propertyId: z.string().uuid().optional().nullable(),
  serviceName: z.string().trim().min(1).max(120),
  frequency: z.string().trim().min(1).max(80),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  preferredDay: z.string().trim().max(40).optional().nullable(),
  priceCents: z.coerce.number().int().min(0).optional().nullable(),
  active: z.boolean().default(true),
  seasonalPause: z.boolean().default(false),
  notes: z.string().trim().max(4000).optional().nullable(),
});

export const updateRecurringSchema = createRecurringSchema.partial().extend({
  customerId: z.string().uuid().optional(),
});

export function dollarsToCents(value: string | number): number {
  const n = typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

export function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}
