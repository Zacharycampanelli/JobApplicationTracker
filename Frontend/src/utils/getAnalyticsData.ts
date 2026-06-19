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

export type ApplicationVelocityItem = {
  label: string;
  value: number;
}

export type AnalyticsData = {
  stats: AnalyticsMetric[];
  pipelineDistribution: PipelineDistributionItem[];
  applicationVelocity: ApplicationVelocityItem[];
};

const getApplicationVelocity = (
  applications: JobApplication[]
) : ApplicationVelocityItem[] => {
  const now = new Date();

  const weeks = Array.from({ length: 4}, (_, index) => {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (3 - index) * 7);

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    return {
      label: `Week ${index + 1}`,
      start: weekStart,
      end: weekEnd,
      value: 0
    }
  })
  applications.forEach((app) => {
    const appliedDate = new Date(app.appliedAt);
    const matchingWeek = weeks.find((week) => appliedDate >= week.start && appliedDate <= week.end)
    
    if(matchingWeek) {
      matchingWeek.value += 1;
    }
  })

  return weeks.map(({label, value}) => ({ label, value}))
}



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
    ],
    applicationVelocity: getApplicationVelocity(applications)
  };
};
