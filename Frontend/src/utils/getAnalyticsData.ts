import type DayIndicator from "../components/shared/DayIndicator";
import type { JobApplication } from "../types/types";
import {
  activePipelineRate,
  applicationCount,
  averageResponseDays,
  interviewRate,
  responseRate
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
};

export type SourceBreakdownItem = {
  label: string;
  value: number;
  color: string;
};

export type PeakActivityItem = {
  label: string | string[];
  count: number;
};

export type AnalyticsData = {
  stats: AnalyticsMetric[];
  pipelineDistribution: PipelineDistributionItem[];
  applicationVelocity: ApplicationVelocityItem[];
  sourceBreakdown: SourceBreakdownItem[];
  peakActivity: PeakActivityItem;
};

const sourceLabels: Record<string, string> = {
  LINKEDIN: "LinkedIn",
  INDEED: "Indeed",
  COMPANY_SITE: "Company Site",
  REFERRAL: "Referral",
  RECRUITER: "Recruiter",
  NETWORKING: "Networking",
  OTHER: "Other"
};

const sourceColors: Record<string, string> = {
  LINKEDIN: "#4c56af",
  INDEED: "#8b92d6",
  COMPANY_SITE: "#404a99",
  REFERRAL: "#186d54",
  RECRUITER: "#66757d",
  NETWORKING: "#a9b4b9",
  OTHER: "#9f403d"
};

const dayLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const getApplicationVelocity = (
  applications: JobApplication[]
): ApplicationVelocityItem[] => {
  const now = new Date();

  const weeks = Array.from({ length: 4 }, (_, index) => {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (3 - index) * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return {
      label: `Week ${index + 1}`,
      start: weekStart,
      end: weekEnd,
      value: 0
    };
  });
  applications.forEach((app) => {
    const appliedDate = new Date(app.appliedAt);
    const matchingWeek = weeks.find(
      (week) => appliedDate >= week.start && appliedDate <= week.end && appliedDate <= now
    );

    if (matchingWeek) {
      matchingWeek.value += 1;
    }
  });

  return weeks.map(({ label, value }) => ({ label, value }));
};

const getSourceBreakdown = (
  applications: JobApplication[]
): SourceBreakdownItem[] => {
  const counts = applications.reduce<Record<string, number>>((acc, app) => {
    const source = app.source ?? "OTHER";
    acc[source] = (acc[source] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).map(([source, value]) => ({
    label: sourceLabels[source] ?? source,
    value,
    color: sourceColors[source] ?? "#66757d"
  }));
};

const getPeakActivity = (applications: JobApplication[]): PeakActivityItem => {
  const dayCounts = applications.reduce<Record<string, number>>((acc, app) => {
    const dayName = dayLabels[new Date(app.appliedAt).getDay()];

    acc[dayName] = (acc[dayName] ?? 0) + 1;

    return acc;
  }, {});

  // find if there are multiple keys with same max value
  const maxCount = Math.max(...Object.values(dayCounts));
  const peakDays = dayLabels.filter(
    (day) => dayCounts[day] === maxCount
  );

  if (peakDays.length > 1) {
    return {
      // return multiple peak days
      label: peakDays,
      count: maxCount
    };
  }

  const peakDay = peakDays[0];

  if (!peakDay) {
    return {
      label: "No activity yet",
      count: 0
    };
  }

  return {
    label: peakDay,
    count: maxCount
  };
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
    ],
    applicationVelocity: getApplicationVelocity(applications),
    sourceBreakdown: getSourceBreakdown(applications),
    peakActivity: getPeakActivity(applications)
  };
};
