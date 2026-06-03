import type { JobApplication } from "../types/types";

export const applicationCount = (applications: JobApplication[]) => {
  return applications.length;
};

export const interviewRate = (applications: JobApplication[]) => {
  const interviews = applications.filter((app) => app.status === "INTERVIEW");
  return (interviews.length / applications.length) * 100;
};

export const rejectionRate = (applications: JobApplication[]) => {
  const rejections = applications.filter((app) => app.status === "REJECTED");
  return (rejections.length / applications.length) * 100;
};

export const successRate = (applications: JobApplication[]) => {
  const offers = applications.filter((app) => app.status === "OFFER");
  return (offers.length / applications.length) * 100;
};
