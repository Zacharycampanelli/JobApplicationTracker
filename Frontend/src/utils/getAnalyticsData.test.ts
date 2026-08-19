import { afterEach, describe, expect, test, vi } from "vitest";

import type { JobApplication } from "../types/types";
import { getAnalyticsData } from "./getAnalyticsData";
import { makeApplication } from "./makeApplicationTest";

describe("getAnalyticsData", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("returns safe values when given an empty application list", () => {
    const result = getAnalyticsData([]);

    expect(result.pipelineDistribution).toEqual([
      {
        label: "Applied",
        value: 0,
        color: "#4c56af"
      },
      {
        label: "Interview",
        value: 0,
        color: "#8b92d6"
      },
      {
        label: "Offer",
        value: 0,
        color: "#186d54"
      },
      {
        label: "Rejected",
        value: 0,
        color: "#9f403d"
      }
    ]);
    expect(result.sourceBreakdown).toEqual([]);
    expect(result.peakActivity).toEqual({
      label: "No activity yet",
      count: 0
    });
  });

  test("Pipeline Distribution verifies the application status and counts correctly", () => {
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
      }),
      makeApplication({
        publicId: "application-5",
        status: "APPLIED"
      })
    ];

    const result = getAnalyticsData(applications);

    expect(
      result.pipelineDistribution.map(({ label, value }) => ({ label, value }))
    ).toEqual([
      {
        label: "Applied",
        value: 2
      },
      {
        label: "Interview",
        value: 1
      },
      {
        label: "Offer",
        value: 1
      },
      {
        label: "Rejected",
        value: 1
      }
    ]);
  });

  test("Source Breakdown returns the correct source breakdown counts", () => {
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        source: "LINKEDIN"
      }),
      makeApplication({
        publicId: "application-2",
        source: "INDEED"
      }),
      makeApplication({
        publicId: "application-3",
        source: "COMPANY_SITE"
      }),
      makeApplication({
        publicId: "application-4",
        source: "REFERRAL"
      }),
      makeApplication({
        publicId: "application-5",
        source: "RECRUITER"
      }),
      makeApplication({
        publicId: "application-6",
        source: "NETWORKING"
      }),
      makeApplication({
        publicId: "application-7",
        source: "OTHER"
      }),
      makeApplication({
        publicId: "application-8",
        source: "LINKEDIN"
      }),
      makeApplication({
        publicId: "application-9",
        source: null
      })
    ];
    const result = getAnalyticsData(applications);

    expect(result.sourceBreakdown).toEqual([
      {
        label: "LinkedIn",
        value: 2,
        color: "#4c56af"
      },
      {
        label: "Indeed",
        value: 1,
        color: "#8b92d6"
      },
      {
        label: "Company Site",
        value: 1,
        color: "#404a99"
      },
      {
        label: "Referral",
        value: 1,
        color: "#186d54"
      },
      {
        label: "Recruiter",
        value: 1,
        color: "#66757d"
      },
      {
        label: "Networking",
        value: 1,
        color: "#a9b4b9"
      },
      {
        label: "Other",
        value: 2,
        color: "#9f403d"
      }
    ]);

    expect(result.sourceBreakdown).toHaveLength(7);
  });

  test("counts applications without a source as Other", () => {
    // Arrange
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        source: null
      }),
      makeApplication({
        publicId: "application-2",
        source: undefined
      })
    ];

    // Act
    const result = getAnalyticsData(applications);

    // Assert
    expect(result.sourceBreakdown).toEqual([
      {
        label: "Other",
        value: 2,
        color: "#9f403d"
      }
    ]);
  });

  test("Peak activity returns the day with the most applications", () => {
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        appliedAt: "2022-01-01T12:00:00"
      }),
      makeApplication({
        publicId: "application-2",
        appliedAt: "2022-01-01T12:00:00"
      }),
      makeApplication({
        publicId: "application-3",
        appliedAt: "2022-01-01T12:00:00"
      }),
      makeApplication({
        publicId: "application-4",
        appliedAt: "2022-01-02T12:00:00"
      }),
      makeApplication({
        publicId: "application-5",
        appliedAt: "2022-01-03T12:00:00"
      })
    ];
    const result = getAnalyticsData(applications);

    expect(result.peakActivity).toEqual({
      label: "Saturday",
      count: 3
    });
  });

  test("returns every day tied for peak activity", () => {
    // Arrange
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        appliedAt: "2022-01-04T12:00:00" // Tuesday
      }),
      makeApplication({
        publicId: "application-2",
        appliedAt: "2022-01-03T12:00:00" // Monday
      }),
      makeApplication({
        publicId: "application-3",
        appliedAt: "2022-01-03T15:00:00" // Monday
      }),
      makeApplication({
        publicId: "application-4",
        appliedAt: "2022-01-04T15:00:00" // Tuesday
      }),
      makeApplication({
        publicId: "application-5",
        appliedAt: "2022-01-05T12:00:00" // Wednesday
      })
    ];

    // Act
    const result = getAnalyticsData(applications);

    // Assert
    expect(result.peakActivity).toEqual({
      label: ["Monday", "Tuesday"],
      count: 2
    });
  });

  test("groups applications into the correct four-week period", () => {
    // Arrange
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2022-01-22T12:00:00"));

    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        appliedAt: "2022-01-01T12:00:00"
      }),
      makeApplication({
        publicId: "application-2",
        appliedAt: "2022-01-09T12:00:00"
      }),
      makeApplication({
        publicId: "application-3",
        appliedAt: "2022-01-16T12:00:00"
      }),
      makeApplication({
        publicId: "application-4",
        appliedAt: "2022-01-22T12:00:00"
      })
    ];

    // Act
    const result = getAnalyticsData(applications);

    // Assert
    expect(result.applicationVelocity).toEqual([
      { label: "Week 1", value: 1 },
      { label: "Week 2", value: 1 },
      { label: "Week 3", value: 1 },
      { label: "Week 4", value: 1 }
    ]);
  });

  test("groups applications into all four periods", () => {
    // Arrange
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2022-01-22T12:00:00"));

    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        appliedAt: "2022-01-01T12:00:00"
      }),
      makeApplication({
        publicId: "application-2",
        appliedAt: "2022-01-08T12:00:00"
      }),
      makeApplication({
        publicId: "application-3",
        appliedAt: "2022-01-08T12:00:00"
      }),
      makeApplication({
        publicId: "application-4",
        appliedAt: "2022-01-15T12:00:00"
      }),
      makeApplication({
        publicId: "application-5",
        appliedAt: "2022-01-15T12:00:00"
      }),
      makeApplication({
        publicId: "application-6",
        appliedAt: "2022-01-15T12:00:00"
      }),
      makeApplication({
        publicId: "application-7",
        appliedAt: "2022-01-22T12:00:00"
      }),
      makeApplication({
        publicId: "application-8",
        appliedAt: "2022-01-22T12:00:00"
      }),
      makeApplication({
        publicId: "application-9",
        appliedAt: "2022-01-22T12:00:00"
      }),
      makeApplication({
        publicId: "application-10",
        appliedAt: "2022-01-22T12:00:00"
      })
    ];

    // Act
    const result = getAnalyticsData(applications);

    // Assert
    expect(result.applicationVelocity).toEqual([
      { label: "Week 1", value: 1 },
      { label: "Week 2", value: 2 },
      { label: "Week 3", value: 3 },
      { label: "Week 4", value: 4 }
    ]);
  });

  test("applications at the start of the week are grouped correctly", () => {
    // Arrange
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2022-01-22T12:00:00"));

    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        appliedAt: "2022-01-01T12:00:00"
      }),
      makeApplication({
        publicId: "application-2",
        appliedAt: "2022-01-08T12:00:00"
      }),
      makeApplication({
        publicId: "application-3",
        appliedAt: "2022-01-15T12:00:00"
      }),
      makeApplication({
        publicId: "application-4",
        appliedAt: "2022-01-22T12:00:00"
      })
    ];

    // Act
    const result = getAnalyticsData(applications);

    // Assert
    expect(result.applicationVelocity).toEqual([
      { label: "Week 1", value: 1 },
      { label: "Week 2", value: 1 },
      { label: "Week 3", value: 1 },
      { label: "Week 4", value: 1 }
    ]);
  });

  test("applications at the end of the week are grouped correctly", () => {
    // Arrange
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2022-01-22T12:00:00"));

    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        appliedAt: "2022-01-07T12:00:00"
      }),
      makeApplication({
        publicId: "application-2",
        appliedAt: "2022-01-14T12:00:00"
      }),
      makeApplication({
        publicId: "application-3",
        appliedAt: "2022-01-21T12:00:00"
      }),
      makeApplication({
        publicId: "application-4",
        appliedAt: "2022-01-22T12:00:00"
      })
    ];

    // Act
    const result = getAnalyticsData(applications);

    // Assert
    expect(result.applicationVelocity).toEqual([
      { label: "Week 1", value: 1 },
      { label: "Week 2", value: 1 },
      { label: "Week 3", value: 1 },
      { label: "Week 4", value: 1 }
    ]);
  });

  test("applications before the start of the four week period are excluded", () => {
    // Arrange
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2022-01-22T12:00:00"));

    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        appliedAt: "2022-01-01T11:59:59.999"
      }),
      makeApplication({
        publicId: "application-2",
        appliedAt: "2022-01-01T12:00:00"
      }),
      makeApplication({
        publicId: "application-3",
        appliedAt: "2022-01-08T12:00:00"
      }),
      makeApplication({
        publicId: "application-4",
        appliedAt: "2022-01-15T12:00:00"
      }),
      makeApplication({
        publicId: "application-5",
        appliedAt: "2022-01-22T12:00:00"
      })
    ];

    // Act
    const result = getAnalyticsData(applications);

    // Assert
    expect(result.applicationVelocity).toEqual([
      { label: "Week 1", value: 1 },
      { label: "Week 2", value: 1 },
      { label: "Week 3", value: 1 },
      { label: "Week 4", value: 1 }
    ]);
  });

  test("applications after the current time are excluded", () => {
    // Arrange
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2022-01-22T12:00:00"));

    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        appliedAt: "2022-01-01T12:00:00"
      }),
      makeApplication({
        publicId: "application-2",
        appliedAt: "2022-01-08T12:00:00"
      }),
      makeApplication({
        publicId: "application-3",
        appliedAt: "2022-01-15T12:00:00"
      }),
      makeApplication({
        publicId: "application-4",
        appliedAt: "2022-01-22T12:00:00"
      }),
      makeApplication({
        publicId: "application-5",
        appliedAt: "2022-01-22T12:00:00.001"
      })
    ];

    // Act
    const result = getAnalyticsData(applications);

    // Assert
    expect(result.applicationVelocity).toEqual([
      { label: "Week 1", value: 1 },
      { label: "Week 2", value: 1 },
      { label: "Week 3", value: 1 },
      { label: "Week 4", value: 1 }
    ]);
  });

  test("assembles the analytics stats with the correct values and display settings", () => {
    // Arrange
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        status: "APPLIED",
        appliedAt: "2022-01-01T00:00:00.000Z",
        firstResponseAt: "2022-01-03T00:00:00.000Z"
      }),
      makeApplication({
        publicId: "application-2",
        status: "INTERVIEW",
        appliedAt: "2022-01-01T00:00:00.000Z",
        firstResponseAt: "2022-01-05T00:00:00.000Z"
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
    const result = getAnalyticsData(applications);

    // Assert
    expect(result.stats).toEqual([
      {
        title: "RESPONSE RATE",
        value: 50,
        suffix: "%"
      },
      {
        title: "TOTAL APPLICATIONS",
        value: 4,
        progressBar: true,
        variant: "compact"
      },
      {
        title: "INTERVIEWS",
        value: 25,
        suffix: "%",
        progressBar: true,
        variant: "compact"
      },
      {
        title: "ACTIVE PIPELINE",
        value: 50,
        suffix: "%",
        progressBar: true,
        variant: "compact"
      },
      {
        title: "AVERAGE RESPONSE DAYS",
        value: 3,
        suffix: " days",
        variant: "compact"
      }
    ]);
  });
});
