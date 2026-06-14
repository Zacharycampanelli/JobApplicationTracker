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

export const offerRate = (applications: JobApplication[]) => {
  const offers = applications.filter((app) => app.status === "OFFER");
  return percentage(offers.length, applications.length);
};

export const activePipelineRate = (applications: JobApplication[]) => {
  const active = applications.filter(
    (app) => app.status === "APPLIED" || app.status === "INTERVIEW"
  );
  return percentage(active.length, applications.length);
};

export const responseRate = (applications: JobApplication[]) => {
  const responses = applications.filter((app) => app.firstResponseAt);
  return percentage(responses.length, applications.length);
};

export const averageResponseDays = (applications: JobApplication[]) => {
  const responses = applications.filter((app) => app.firstResponseAt);
  if (responses.length === 0) return 0;

  const totalDays = responses.reduce((acc, app) => {
    const responseDays = Math.floor(
      (new Date(app.firstResponseAt!).getTime() -
        new Date(app.appliedAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return acc + responseDays;
  }, 0);
  return Math.floor(totalDays / responses.length);
};
