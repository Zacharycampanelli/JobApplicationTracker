import type { ApplicationSource, JobStatus, WorkMode } from '../../generated/prisma/enums.js';

type ParsedApplicationData = {
  title: string;
  company: string;
  status: JobStatus;
  link?: string;
  source?: ApplicationSource;
  salaryMin?: number;
  salaryMax?: number;
  location?: string | null;
  notes?: string;
  workMode?: WorkMode;
  appliedAt?: Date;
  firstResponseAt?: Date;
  interviewAt?: Date;
  offerAt?: Date;
  rejectedAt?: Date;
};

type ParseApplicationPayloadResult = { success: false; error: string } | { success: true; data: ParsedApplicationData };

export const parseApplicationPayload = (applicationData: any): ParseApplicationPayloadResult => {
  const {
    title,
    company,
    status,
    link,
    source,
    salaryMin,
    salaryMax,
    location,
    notes,
    workMode,
    appliedAt,
    firstResponseAt,
    interviewAt,
    offerAt,
    rejectedAt,
  } = applicationData;
  if (!title || !company || !status) {
    return { success: false, error: 'Missing required fields' };
  }

  const allowedStatuses = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];
  if (!allowedStatuses.includes(status)) {
    return { success: false, error: 'Invalid status' };
  }

  const allowedSources = ['LINKEDIN', 'INDEED', 'COMPANY_SITE', 'REFERRAL', 'RECRUITER', 'NETWORKING', 'OTHER'];
  if (source && !allowedSources.includes(source)) {
    return { success: false, error: 'Invalid source' };
  }

  const allowedWorkModes = ['REMOTE', 'HYBRID', 'ONSITE'];
  if (workMode && !allowedWorkModes.includes(workMode)) {
    return { success: false, error: 'Invalid work mode' };
  }

  const parsedAppliedAt = appliedAt ? new Date(appliedAt) : undefined;
  if (parsedAppliedAt && isNaN(parsedAppliedAt.getTime())) {
    return { success: false, error: 'Invalid applied date' };
  }

  const parsedFirstResponseAt = firstResponseAt ? new Date(firstResponseAt) : undefined;
  if (parsedFirstResponseAt && isNaN(parsedFirstResponseAt.getTime())) {
    return { success: false, error: 'Invalid first response date' };
  }

  const parsedInterviewAt = interviewAt ? new Date(interviewAt) : undefined;
  if (parsedInterviewAt && isNaN(parsedInterviewAt.getTime())) {
    return { success: false, error: 'Invalid interview date' };
  }

  const parsedOfferAt = offerAt ? new Date(offerAt) : undefined;
  if (parsedOfferAt && isNaN(parsedOfferAt.getTime())) {
    return { success: false, error: 'Invalid offer date' };
  }

  const parsedRejectedAt = rejectedAt ? new Date(rejectedAt) : undefined;
  if (parsedRejectedAt && isNaN(parsedRejectedAt.getTime())) {
    return { success: false, error: 'Invalid rejected date' };
  }

  if (parsedFirstResponseAt && parsedAppliedAt && parsedFirstResponseAt < parsedAppliedAt) {
    return { success: false, error: 'First response cannot be before applied date' };
  }

  const parsedSalaryMin = salaryMin ? Number(salaryMin) : undefined;
  if (parsedSalaryMin !== undefined && Number.isNaN(parsedSalaryMin)) {
    return { success: false, error: 'Invalid minimum salary' };
  }

  const parsedSalaryMax = salaryMax ? Number(salaryMax) : undefined;
  if (parsedSalaryMax !== undefined && Number.isNaN(parsedSalaryMax)) {
    return { success: false, error: 'Invalid maximum salary' };
  }

  if (parsedSalaryMin !== undefined && parsedSalaryMax !== undefined && parsedSalaryMin >= parsedSalaryMax) {
    return { success: false, error: 'Minimum salary must be less than maximum salary' };
  }

  return {
    success: true,
    data: {
      title,
      company,
      status: status as JobStatus,
      link,
      source: source ? (source as ApplicationSource) : undefined,
      salaryMin: parsedSalaryMin,
      salaryMax: parsedSalaryMax,
      location: typeof location === 'string' && location.trim() ? location.trim() : null,
      notes,
      workMode: workMode ? (workMode as WorkMode) : undefined,
      appliedAt: parsedAppliedAt,
      firstResponseAt: parsedFirstResponseAt,
      interviewAt: parsedInterviewAt,
      offerAt: parsedOfferAt,
      rejectedAt: parsedRejectedAt,
    },
  };
};
