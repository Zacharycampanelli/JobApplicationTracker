import type { JobApplication } from "../types/types";

export const applicationCount = (applications: JobApplication[]) => {
  return applications.length;
};

export const interviewRate = (applications: JobApplication[]) => {
  const interviews = applications.filter((app) => app.status === "INTERVIEW");
  return Math.floor((interviews.length / applications.length) * 100);
};

export const rejectionRate = (applications: JobApplication[]) => {
  const rejections = applications.filter((app) => app.status === "REJECTED");
  return Math.floor((rejections.length / applications.length) * 100);
};

export const successRate = (applications: JobApplication[]) => {
  const offers = applications.filter((app) => app.status === "OFFER");
  return Math.floor((offers.length / applications.length) * 100);
};

export const totalLeadsRate = (applications: JobApplication[]) => {
  const leads = applications.filter((app) => app.status === "APPLIED");
  const interviews = interviewRate(applications);
  const offers = successRate(applications);
  return Math.floor(
    ((interviews + offers + leads.length) / applications.length) * 100
  );
};
