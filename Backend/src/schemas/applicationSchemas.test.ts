import { describe, expect, it } from "vitest";

import { applicationPayloadSchema, applicationStatusSchema } from "./applicationSchemas";

const makePayload = (overrides: Record<string, unknown> = {}) => ({
  title: "Software Engineer",
  company: "Example Company",
  status: "APPLIED",
  appliedAt: "2026-09-10",
  ...overrides,
});

describe("applicationPayloadSchema", () => {
  it.each([
    {
      description: "a whitespace-only title",
      overrides: { title: "   " },
    },
    {
      description: "a boolean salary",
      overrides: { salaryMin: false },
    },
    {
      description: "a non-positive resume ID",
      overrides: { resumeId: 0 },
    },
    {
      description: "a non-HTTP URL",
      overrides: { link: "javascript:alert(1)" },
    },
  ])("rejects $description", ({ overrides }) => {
    const result = applicationPayloadSchema.safeParse(makePayload(overrides));

    expect(result.success).toBe(false);
  });
});

describe("applicationStatusSchema", () => {
  it("rejects an unsupported status", () => {
    const result = applicationStatusSchema.safeParse({ status: "PENDING" });

    expect(result.success).toBe(false);
  });
});
