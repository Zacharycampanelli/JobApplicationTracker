import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters long"),
  summary: z.string().trim().nullable().optional(),
  title: z.string().trim().nullable().optional(),
  location: z.string().trim().nullable().optional(),
  website: z.httpUrl().optional().nullable(),
  linkedin: z.httpUrl().optional().nullable(),
});

export const updatePreferencesSchema = z.object({
  publicProfileEnabled: z.boolean({ error: "Public profile: Yes or no must be selected" }),
  autoStatusUpdatesEnabled: z.boolean({ error: "Auto-status updates: Yes or no must be selected" }),
  themePreference: z.enum(["light", "dark", "system"], {
    error: "Theme preference must be light, dark, or system",
  }),
});
