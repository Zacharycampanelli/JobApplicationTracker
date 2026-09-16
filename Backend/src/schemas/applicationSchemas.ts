import z from "zod";

export const applicationPayloadSchema = z.object({
  title: z.string({ error: "Title is required" }).trim().min(1, "Title is required"),
  company: z.string({ error: "Company is required" }).trim().min(1, "Company is required"),
  status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED"], { error: "Invalid status" }),
  appliedAt: z.string({ error: "Applied date is required" }).min(1, "Applied date is required"),
  location: z.string().trim().nullable().optional(),
  notes: z.string().trim().nullable().optional(),
  link: z.union([z.httpUrl({ error: "Invalid URL" }), z.literal("")]).nullish(),
  source: z
    .enum(["LINKEDIN", "INDEED", "COMPANY_SITE", "REFERRAL", "RECRUITER", "NETWORKING", "OTHER"])
    .optional()
    .nullable(),
  workMode: z.enum(["ONSITE", "HYBRID", "REMOTE"]).optional().nullable(),
  salaryMin: z.number().finite().optional().nullable(),
  salaryMax: z.number().finite().optional().nullable(),
  firstResponseAt: z.string().optional().nullable(),
  interviewAt: z.string().optional().nullable(),
  offerAt: z.string().optional().nullable(),
  rejectedAt: z.string().optional().nullable(),
  resumeId: z.number().int().positive().optional().nullable(),
});

export const applicationStatusSchema = z.object({
  status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED"], "Invalid status"),
});
