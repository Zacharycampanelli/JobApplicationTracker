import type { JobApplication } from "../types/types";
import {
  activePipelineRate,
  applicationCount,
  averageResponseDays,
  interviewRate,
  responseRate,
} from "../utils/getStats";

export type AnalyticsMetric = {
  title: string;
  value: number;
  suffix?: string;
  progressBar?: boolean;
  variant?: "featured" | "compact";
};

export type PipelineDistributionItem = {
  label: string;
  value: number;
};

export type AnalyticsData = {
  stats: AnalyticsMetric[];
  pipelineDistribution: PipelineDistributionItem[];
};

export const getAnalyticsData = (
  applications: JobApplication[]
): AnalyticsData => {
  const applied = applications.filter((app) => app.status === "APPLIED").length;
  const interviews = applications.filter(
    (app) => app.status === "INTERVIEW"
  ).length;
  const offers = applications.filter((app) => app.status === "OFFER").length;
  const rejected = applications.filter(
    (app) => app.status === "REJECTED"
  ).length;

  return {
    stats: [
      {
        title: "RESPONSE RATE",
        value: responseRate(applications),
        suffix: "%"
      },
      {
        title: "TOTAL APPLICATIONS",
        value: applicationCount(applications),
        progressBar: true,
        variant: "compact"
      },
      {
        title: "INTERVIEWS",
        value: interviewRate(applications),
        suffix: "%",
        progressBar: true,
        variant: "compact"
      },
      {
        title: "ACTIVE PIPELINE",
        value: activePipelineRate(applications),
        suffix: "%",
        progressBar: true,
        variant: "compact"
      },
      {
        title: "AVERAGE RESPONSE DAYS",
        value: averageResponseDays(applications),
        suffix: " days",
        variant: "compact"
      }
    ],
    pipelineDistribution: [
      {
        label: "Applied",
        value: applied
      },
      {
        label: "Interview",
        value: interviews
      },
      {
        label: "Offer",
        value: offers
      },
      {
        label: "Rejected",
        value: rejected
      }
    ]
  };
};
