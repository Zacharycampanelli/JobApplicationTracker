import { describe, expect, it } from "vitest";

import { validateEnvironment } from "./validateEnvironment";

const validEnvironment: NodeJS.ProcessEnv = {
  DATABASE_URL: "postgresql://example",
  JWT_SECRET: "secret",
  FRONTEND_URL: "http://localhost:5173",
  BREVO_API_KEY: "key",
  EMAIL_FROM_ADDRESS: "sender@example.com",
};

describe("validateEnvironment", () => {
  it("accepts an environment containing every required variable", () => {
    expect(() => validateEnvironment(validEnvironment)).not.toThrow();
  });

  it("reports every missing required variable", () => {
    const incompleteEnvironment: NodeJS.ProcessEnv = {
      ...validEnvironment,
    };

    delete incompleteEnvironment.JWT_SECRET;
    delete incompleteEnvironment.FRONTEND_URL;

    expect(() => validateEnvironment(incompleteEnvironment)).toThrow(
      "Missing required environment variables: JWT_SECRET, FRONTEND_URL",
    );
  });
});
