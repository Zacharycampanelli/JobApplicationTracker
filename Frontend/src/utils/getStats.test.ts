import { describe, expect, test } from "vitest";
import { activePipelineRate, applicationCount, interviewRate, offerRate, rejectionRate, responseRate } from "./getStats";
import type { JobApplication } from "../types/types";

const makeApplication = (
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

describe("responseRate", () => {
  test("returns 0 when there are no applications", () => {
    // Arrange
    const applications: JobApplication[] = [];

    // Act
    const result = responseRate(applications);

    // Assert
    expect(result).toBe(0);
  });

  test("returns the percentage of applications that have a response", () => {
    // Arrange
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "APPLIED"
      }),
      makeApplication({
        publicId: "application-2",
        status: "INTERVIEW"
      })
    ];
    // Act
    const result = responseRate(applications);

    // Assert
    expect(result).toBe(50);
  });
});

describe("activePipelineRate", () => {
  test("returns 0 when there are no applications", () => {
    // Arrange
    const applications: JobApplication[] = [];

    // Act
    const result = activePipelineRate(applications);

    // Assert
    expect(result).toBe(0);
  });

  test("returns the percentage of applications in the active pipeline", () => {
    // Arrange
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "APPLIED"
      }),
      makeApplication({
        publicId: "application-2",
        status: "INTERVIEW"
      }),
      makeApplication({
        publicId: "application-3",
        status: "OFFER"
      }),
      makeApplication({
        publicId: "application-4",
        status: "REJECTED"
      })
    ];

    // Act
    const result = activePipelineRate(applications);

    // Assert
    expect(result).toBe(50);
  });

  test("returns 100% if all applications are in the active pipeline", () => {
    // Arrange: two applications in the active pipeline
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "APPLIED"
      }),
      makeApplication({
        publicId: "application-2",
        status: "INTERVIEW"
      })
    ];
    // Act
    const result = activePipelineRate(applications);

    // Assert
    expect(result).toBe(100);
  });
});

describe("offerRate", () => {
  test("returns 0 when there are no applications", () => {
    // Arrange
    const applications: JobApplication[] = [];

    // Act
    const result = offerRate(applications);

    // Assert
    expect(result).toBe(0);
  });

  test("returns the percentage of applications in the offer stage", () => {
    // Arrange
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "OFFER"
      }),
      makeApplication({
        publicId: "application-2",
        status: "OFFER"
      }),
      makeApplication({
        publicId: "application-3",
        status: "APPLIED"
      }),
      makeApplication({
        publicId: "application-4",
        status: "INTERVIEW"
      })
    ];

    // Act
    const result = offerRate(applications);

    // Assert
    expect(result).toBe(50);
  });

  test("returns 100% if all applications are in the offer stage", () => {
    // Arrange: two applications in the offer stage
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "OFFER"
      }),
      makeApplication({
        publicId: "application-2",
        status: "OFFER"
      })
    ];
    // Act
    const result = offerRate(applications);

    // Assert
    expect(result).toBe(100);
  });
});

describe("rejectionRate", () => {
  test("returns 0 when there are no applications", () => {
    // Arrange
    const applications: JobApplication[] = [];

    // Act
    const result = rejectionRate(applications);

    // Assert
    expect(result).toBe(0);
  });

  test("returns the percentage of applications in the rejected stage", () => {
    // Arrange
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "REJECTED"
      }),
      makeApplication({
        publicId: "application-2",
        status: "REJECTED"
      }),
      makeApplication({
        publicId: "application-3",
        status: "APPLIED"
      }),
      makeApplication({
        publicId: "application-4",
        status: "INTERVIEW"
      })
    ];

    // Act
    const result = rejectionRate(applications);

    // Assert
    expect(result).toBe(50);
  });

  test("returns 100% if all applications are rejected", () => {
    // Arrange: two rejected applications
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "REJECTED"
      }),
      makeApplication({
        publicId: "application-2",
        status: "REJECTED"
      })
    ];
    // Act
    const result = rejectionRate(applications);

    // Assert
    expect(result).toBe(100);
  });
});

describe("interviewRate", () => {
  test("returns 0 when there are no applications", () => {
    // Arrange
    const applications: JobApplication[] = [];

    // Act
    const result = interviewRate(applications);

    // Assert
    expect(result).toBe(0);
  });

  test("returns the percentage of applications in the interview stage", () => {
    // Arrange
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "INTERVIEW"
      }),
      makeApplication({
        publicId: "application-2",
        status: "INTERVIEW"
      }),
      makeApplication({
        publicId: "application-3",
        status: "APPLIED"
      }),
      makeApplication({
        publicId: "application-4",
        status: "REJECTED"
      })
    ];

    // Act
    const result = interviewRate(applications);

    // Assert
    expect(result).toBe(50);
  });

  test("returns 100% if all applications are interviewing", () => {
    // Arrange: two interview applications
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "INTERVIEW"
      }),
      makeApplication({
        publicId: "application-2",
        status: "INTERVIEW"
      })
    ];
    // Act
    const result = interviewRate(applications);

    // Assert
    expect(result).toBe(100);
  });
});

describe("applicationCount", () => {
  test("returns 0 when there are no applications", () => {
    // Arrange
    const applications: JobApplication[] = [];

    // Act
    const result = applicationCount(applications);

    // Assert
    expect(result).toBe(0);
  });

  test("returns the total number of applications", () => {
    // Arrange
    const applications: JobApplication[] = [
      makeApplication({ publicId: "application-1" }),
      makeApplication({ publicId: "application-2" }),
      makeApplication({ publicId: "application-3" })
    ];

    // Act
    const result = applicationCount(applications);

    // Assert
    expect(result).toBe(3);
  });
});

describe("interviewRate", () => {
  test("returns 0 when there are no applications", () => {
    // Arrange
    const applications: JobApplication[] = [];

    // Act
    const result = interviewRate(applications);

    // Assert
    expect(result).toBe(0);
  });

  test("returns the percentage of applications in the interview stage", () => {
    // Arrange
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "INTERVIEW"
      }),
      makeApplication({
        publicId: "application-2",
        status: "INTERVIEW"
      }),
      makeApplication({
        publicId: "application-3",
        status: "APPLIED"
      }),
      makeApplication({
        publicId: "application-4",
        status: "REJECTED"
      })
    ];

    // Act
    const result = interviewRate(applications);

    // Assert
    expect(result).toBe(50);
  });

  test("returns 100% if all applications are interviewing", () => {
    // Arrange: two interview applications
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "INTERVIEW"
      }),
      makeApplication({
        publicId: "application-2",
        status: "INTERVIEW"
      })
    ];
    // Act
    const result = interviewRate(applications);

    // Assert
    expect(result).toBe(100);
  });
});
