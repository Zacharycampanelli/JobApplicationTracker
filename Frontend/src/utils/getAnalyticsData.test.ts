import { afterEach, describe, expect, test, vi } from "vitest";
import { getAnalyticsData } from "./getAnalyticsData";
import { makeApplication } from "./makeApplicationTest";
import type { JobApplication } from "../types/types";

describe("getAnalyticsData", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("returns safe values when given an empty application list", () => {
    const result = getAnalyticsData([]);

    expect(result.pipelineDistribution).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Applied",
          value: 0
        }),
        expect.objectContaining({
          label: "Interview",
          value: 0
        }),
        expect.objectContaining({
          label: "Offer",
          value: 0
        }),
        expect.objectContaining({
          label: "Rejected",
          value: 0
        })
      ])
    );
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

    expect(result.pipelineDistribution.map(({label, value}) => ({label, value}))).toEqual([
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
        publicId: "application-4",
        source: "RECRUITER"
      }),
      makeApplication({
        publicId: "application-4",
        source: "NETWORKING"
      }),
      makeApplication({
        publicId: "application-5",
        source: "OTHER"
      }),
      makeApplication({
        publicId: "application-6",
        source: "LINKEDIN"
      }),
      makeApplication({
        publicId: "application-7",
        source: null
      })
    ];
    const result = getAnalyticsData(applications);

    expect(result.sourceBreakdown).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "LinkedIn",
          value: 2
        }),
        expect.objectContaining({
          label: "Indeed",
          value: 1
        }),
        expect.objectContaining({
          label: "Company Site",
          value: 1
        }),
        expect.objectContaining({
          label: "Referral",
          value: 1
        }),
        expect.objectContaining({
          label: "Recruiter",
          value: 1
        }),
        expect.objectContaining({
          label: "Networking",
          value: 1
        }),
        expect.objectContaining({
          label: "Other",
          value: 2
        })
      ])
    );

    expect(result.sourceBreakdown).toHaveLength(7);
  });

  test("Peak activity returns the day with the most applications", () => {
    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        appliedAt: "2022-01-01T00:00:00-05:00"
      }),
      makeApplication({
        publicId: "application-2",
        appliedAt: "2022-01-01T00:00:00-05:00"
      }),
      makeApplication({
        publicId: "application-3",
        appliedAt: "2022-01-01T00:00:00-05:00"
      }),
      makeApplication({
        publicId: "application-4",
        appliedAt: "2022-01-02T00:00:00-05:00"
      }),
      makeApplication({
        publicId: "application-5",
        appliedAt: "2022-01-03T00:00:00-05:00"
      })
    ];
    const result = getAnalyticsData(applications);

    expect(result.peakActivity).toEqual({
      label: "Saturday",
      count: 3
    });
  });

  test("groups applications into the correct four-week period", () => {
    // Arrange
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2022-01-22T00:00:00-05:00"));

    const applications: JobApplication[] = [
      makeApplication({
        publicId: "application-1",
        appliedAt: "2022-01-01T00:00:00-05:00"
      }),
      makeApplication({
        publicId: "application-2",
        appliedAt: "2022-01-02T00:00:00-05:00"
      }),
      makeApplication({
        publicId: "application-3",
        appliedAt: "2022-01-03T00:00:00-05:00"
      })
    ];

    // Act
    const result = getAnalyticsData(applications);

    // Assert
    expect(result.applicationVelocity).toEqual([
      { label: "Week 1", value: 3 },
      { label: "Week 2", value: 0 },
      { label: "Week 3", value: 0 },
      { label: "Week 4", value: 0 }
    ]);
  });
});
