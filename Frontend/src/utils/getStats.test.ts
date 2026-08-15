import { describe, expect, test } from "vitest";

import type { JobApplication } from "../types/types";
import { activePipelineRate, applicationCount, averageResponseDays, interviewRate, offerRate, rejectionRate, responseRate } from "./getStats";
import { makeApplication } from "./makeApplicationTest";

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
        status: "INTERVIEW",
        firstResponseAt: "2026-07-02T00:00:00.000Z"
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

  test("rounds percentages down to the nearest whole number", () => {
    // Arrange
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "INTERVIEW"
      }),
      makeApplication({
        publicId: "application-2",
        status: "APPLIED"
      }),
      makeApplication({
        publicId: "application-4",
        status: "REJECTED"
      }),

    ];
    // Act
    const result = interviewRate(applications);
    // Assert
    expect(result).toBe(33);
  })
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

describe("averageResponseDays", ()=> {
  test("returns 0 when there are no applications", ()=> {
    // Arrange
    const applications: JobApplication[] = [];

    // Act
    const result = averageResponseDays(applications);

    // Assert
    expect(result).toBe(0);
  })
  test("returns the number of days when there is 1 response", ()=> {
    // Arrange
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "INTERVIEW",
        appliedAt: "2022-01-01T00:00:00.000Z",
        firstResponseAt: "2022-01-03T00:00:00.000Z"
      })
    ];

    // Act
    const result = averageResponseDays(applications);

    // Assert
    expect(result).toBe(2);
  })

  test("returns the average number of days it takes to get a response", ()=> {
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "INTERVIEW",
        appliedAt: "2022-01-01T00:00:00.000Z",
        firstResponseAt: "2022-01-03T00:00:00.000Z"
      }),
      makeApplication({
        publicId: "application-2",
        status: "INTERVIEW",
        appliedAt: "2022-01-01T00:00:00.000Z",
        firstResponseAt: "2022-01-05T00:00:00.000Z"
      })
    ];

    // Act
    const result = averageResponseDays(applications);

    // Assert
    expect(result).toBe(3);
  })
  test("applications with partial dates should round down", ()=> {
    // Arrange
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "INTERVIEW",
        appliedAt: "2022-01-01T00:00:00.000Z",
        firstResponseAt: "2022-01-01T12:00:00.000Z"
      })
    ];

    // Act
    const result = averageResponseDays(applications);

    // Assert
    expect(result).toBe(0);
  })
  test("applications with no response are ignored in the calculation", ()=> {
    // Arrange
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "INTERVIEW",
        appliedAt: "2022-01-01T00:00:00.000Z",
        firstResponseAt: "2022-01-03T00:00:00.000Z"
      }),
      makeApplication({
        publicId: "application-2",
        status: "INTERVIEW",
        appliedAt: "2022-01-01T00:00:00.000Z",
        firstResponseAt: null
      })
    ];

    // Act
    const result = averageResponseDays(applications);

    // Assert
    expect(result).toBe(2);
  })

  test("averages resulting in a fraction are rounded down", ()=> {
    // Arrange
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "INTERVIEW",
        appliedAt: "2022-01-01T00:00:00.000Z",
        firstResponseAt: "2022-01-03T00:00:00.000Z"
      }),
      makeApplication({
        publicId: "application-2",
        status: "INTERVIEW",
        appliedAt: "2022-01-01T00:00:00.000Z",
        firstResponseAt: "2022-01-04T00:00:00.000Z"
      })
    ];

    // Act
    const result = averageResponseDays(applications);

    // Assert
    expect(result).toBe(2);
  })
})
