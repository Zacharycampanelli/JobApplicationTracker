import type { JobApplication } from "../types/types";

const percentage = (part: number, total: number) => {
  if (total === 0) return 0;
  return Math.floor((part / total) * 100);
};

export const applicationCount = (applications: JobApplication[]) => {
  return applications.length;
};

export const interviewRate = (applications: JobApplication[]) => {
  const interviews = applications.filter((app) => app.status === "INTERVIEW");
  return percentage(interviews.length, applications.length);
};

export const rejectionRate = (applications: JobApplication[]) => {
  const rejections = applications.filter((app) => app.status === "REJECTED");
  return percentage(rejections.length, applications.length);
};

export const successRate = (applications: JobApplication[]) => {
  const offers = applications.filter((app) => app.status === "OFFER");
  return percentage(offers.length, applications.length);
};

export const totalLeadsRate = (applications: JobApplication[]) => {
  const leads = applications.filter((app) => app.status === "APPLIED");
  const interviews = interviewRate(applications);
  const offers = successRate(applications);
  return percentage(interviews + offers + leads.length, applications.length);
};
