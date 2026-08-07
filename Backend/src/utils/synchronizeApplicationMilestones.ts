import type { JobStatus } from '../../generated/prisma/enums';

type ApplicationMilestones = {
  firstResponseAt: Date | null;
  interviewAt: Date | null;
  offerAt: Date | null;
  rejectedAt: Date | null;
};

export const synchronizeApplicationMilestones = (
  application: ApplicationMilestones,
  newStatus: JobStatus,
  now: Date = new Date(),
) => {
  if (newStatus === 'APPLIED') {
    return {
      status: newStatus,
      firstResponseAt: null,
      interviewAt: null,
      offerAt: null,
      rejectedAt: null,
    };
  }

  if (newStatus === 'INTERVIEW') {
    return {
      status: newStatus,
      firstResponseAt: application.firstResponseAt ?? now,
      interviewAt: application.interviewAt,
      offerAt: null,
      rejectedAt: null,
    };
  }

  if (newStatus === 'OFFER') {
    return {
      status: newStatus,
      firstResponseAt: application.firstResponseAt ?? now,
      interviewAt: application.interviewAt,
      offerAt: application.offerAt,
      rejectedAt: null,
    };
  }

  if (newStatus === 'REJECTED') {
    return {
      status: newStatus,
      firstResponseAt: application.firstResponseAt,
      interviewAt: application.interviewAt,
      offerAt: application.offerAt,
      rejectedAt: application.rejectedAt ?? now,
    };
  }

  return {
    status: newStatus,
    firstResponseAt: application.firstResponseAt,
    interviewAt: application.interviewAt,
    offerAt: application.offerAt,
    rejectedAt: application.rejectedAt,
  };
};
