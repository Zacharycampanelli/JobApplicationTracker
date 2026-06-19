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
  color: string;
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
    value: applied,
    color: "#4c56af"
  },
  {
    label: "Interview",
    value: interviews,
    color: "#8b92d6"
  },
  {
    label: "Offer",
    value: offers,
    color: "#186d54"
  },
  {
    label: "Rejected",
    value: rejected,
    color: "#9f403d"
  }
    ]
  };
};
