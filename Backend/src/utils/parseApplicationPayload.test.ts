import { describe, expect, test } from "vitest";
import { parseApplicationPayload } from "./parseApplicationPayload";

const makePayload = (overrides: Record<string, unknown> = {}) => ({
  title: "Software Engineer",
  company: "Example Company",
  status: "APPLIED",
  appliedAt: "2026-07-01",
  ...overrides
});

describe("parseApplicationPayload", () => {
  test("normalizes first response to null for APPLIED applications", () => {
    // Arrange
    const payload = makePayload({
        status: "APPLIED",
        firstResponseAt: "2026-07-05"
    });

    // Act
    const result = parseApplicationPayload(payload);
    
    // Assert
    if(!result.success){
        throw new Error(`Expected parsing to succeed: ${result.error}`);
    }

    expect(result.data.status).toBe("APPLIED");
    expect(result.data.firstResponseAt).toBeNull();
  });

  test("Rejects an INTERVIEW application without a first response", () => {
    // Arrange
    const payload = makePayload({
        status: "INTERVIEW"
    });
    
    // Act
    const result = parseApplicationPayload(payload);

    // Assert
    expect(result).toEqual({
        success: false,
        error: "First response date is required"
    });
  }) 

   test("retains the first response for an INTERVIEW application", () => {
    // Arrange
  
    const payload = makePayload({
      status: "INTERVIEW",
      firstResponseAt: "2026-07-05",
    });

    // Act
    const result = parseApplicationPayload(payload);

    // Assert
    if(!result.success){
        throw new Error(`Expected parsing to succeed: ${result.error}`);
    }
    expect(result.data.firstResponseAt).toEqual(new Date("2026-07-05"));

  });

  test("rejects an OFFER application without a first response", () => {
    // Arrange
    const payload = makePayload({
        status: "OFFER"
    });
    
    // Act
    const result = parseApplicationPayload(payload);

    // Assert
    expect(result).toEqual({
        success: false,
        error: "First response date is required"
    });
  })

  test("allows a REJECTED application without a first response", () => {
    // Arrange
    const payload = makePayload({
        status: "REJECTED"
    });
    
    // Act
    const result = parseApplicationPayload(payload);

    // Assert
    if(!result.success){
        throw new Error(`Expected parsing to succeed: ${result.error}`);
    }
    expect(result.data.status).toBe("REJECTED");
    expect(result.data.firstResponseAt).toBeUndefined();
  });
});
