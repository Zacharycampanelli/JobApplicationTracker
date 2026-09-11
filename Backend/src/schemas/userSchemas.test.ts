import { describe, expect, it } from "vitest";
import { updatePreferencesSchema, updateProfileSchema } from "./userSchemas";

describe("userSchemas", () => {
  it("Profile rejects a numeric name", () => {
    const name = 1;
    const result = updateProfileSchema.safeParse({ name });

    expect(result.success).toBe(false);
  });

  it("rejects a non-HTTP website URL", () => {
    const result = updateProfileSchema.safeParse({
      name: "Test User",
      website: "javascript:alert(1)",
    });

    expect(result.success).toBe(false);
  });
});

describe("updatePreferencesSchema", () => {
  it("Rejects a non-boolean value for user preferences", () => {
    const result = updatePreferencesSchema.safeParse({
      publicProfileEnabled: "true",
      autoStatusUpdatesEnabled: true,
      themePreference: "dark",
    });

    expect(result.success).toBe(false);
  });

  it("Rejects unsupported themes", () => {
    const result = updatePreferencesSchema.safeParse({
      publicProfileEnabled: true,
      autoStatusUpdatesEnabled: true,
      themePreference: "purple",
    });

    expect(result.success).toBe(false);
  });
});
