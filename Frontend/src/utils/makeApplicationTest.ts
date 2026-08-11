import type { JobApplication } from "../types/types";

export const makeApplication = (
  overrides: Partial<JobApplication> = {}
): JobApplication => ({
  id: 1,
  publicId: "application-1",
  title: "Software Engineer",
  company: "Example Company",
  status: "APPLIED",
  appliedAt: "2026-07-01T00:00:00.000Z",
  userId: 1,
  createdAt: "2026-07-01T00:00:00.000Z",
  updatedAt: "2026-07-01T00:00:00.000Z",
  ...overrides
});