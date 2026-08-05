import type { JobStatus } from "../../generated/prisma/enums";

type ApplicationMilestones = { 
    firstResponseAt: Date | null;
    interviewAt: Date | null;
    offerAt: Date | null;
    rejectedAt: Date | null;
}

export const synchronizeApplicationMilestones = (application: ApplicationMilestones, newStatus: JobStatus, now: Date = new Date()) => {
  if (newStatus === 'APPLIED') {
    return {status: newStatus, firstResponseAt: null};
  }

  if ((newStatus === 'INTERVIEW' || newStatus === 'OFFER') && !application.firstResponseAt) {
    return {status: newStatus, firstResponseAt: now};
  }

  return {
    status: newStatus,
    firstResponseAt: application.firstResponseAt
  }
};
