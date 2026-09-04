import type { ApplicationSource, JobStatus, WorkMode } from '../../generated/prisma/enums.js';
import { synchronizeApplicationMilestones } from './synchronizeApplicationMilestones.js';

type ParsedApplicationData = {
  title: string;
  company: string;
  status: JobStatus;
  link?: string | null;
  source?: ApplicationSource | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  location?: string | null;
  notes?: string | null;
  workMode?: WorkMode | null;
  appliedAt?: Date;
  firstResponseAt?: Date | null;
  interviewAt?: Date | null;
  offerAt?: Date | null;
  rejectedAt?: Date | null;
};

type ParseApplicationPayloadResult = { success: false; error: string } | { success: true; data: ParsedApplicationData };

const parseOptionalDate = (value: unknown, label: string) => {
  if (value === undefined) return { success: true as const, value: undefined };
  if (value === null || value === '') return { success: true as const, value: null };

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return { success: false as const, error: `Invalid ${label} date` };
  }

  return { success: true as const, value: date };
};

const parseOptionalNumber = (value: unknown, label: string) => {
  if (value === undefined) return { success: true as const, value: undefined };
  if (value === null || value === '') return { success: true as const, value: null };

  const num = Number(value);

  if (Number.isNaN(num)) {
    return { success: false as const, error: `Invalid ${label} number` };
  }

  return { success: true as const, value: num };
};

const toDateOnly = (value: Date | null | undefined) => {
  if (!value) return value;
  return value.toISOString().slice(0, 10);
};

type ApplicationPayload = {
  title: string;
  company: string;
  status: string;
  link?: unknown;
  source?: unknown;
  salaryMin?: unknown;
  salaryMax?: unknown;
  location?: unknown;
  notes?: unknown;
  workMode?: unknown;
  appliedAt?: unknown;
  firstResponseAt?: unknown;
  interviewAt?: unknown;
  offerAt?: unknown;
  rejectedAt?: unknown;
};

const isApplicationPayload = (value: unknown): value is ApplicationPayload => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.title === 'string' &&
    payload.title.length > 0 &&
    typeof payload.company === 'string' &&
    payload.company.length > 0 &&
    typeof payload.status === 'string' &&
    payload.status.length > 0
  );
};

export const parseApplicationPayload = (applicationData: unknown): ParseApplicationPayloadResult => {
  if (!isApplicationPayload(applicationData)) {
    return { success: false, error: 'Missing required fields' };
  }

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

  const allowedStatuses = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];

  if (!allowedStatuses.includes(status)) {
    return { success: false, error: 'Invalid status' };
  }

  const allowedSources = ['LINKEDIN', 'INDEED', 'COMPANY_SITE', 'REFERRAL', 'RECRUITER', 'NETWORKING', 'OTHER'];
  if (
    source !== undefined &&
    source !== null &&
    source !== '' &&
    (typeof source !== 'string' || !allowedSources.includes(source))
  ) {
    return {
      success: false,
      error: 'Invalid source',
    };
  }

  const allowedWorkModes = ['REMOTE', 'HYBRID', 'ONSITE'];
  if (
    workMode !== undefined &&
    workMode !== null &&
    workMode !== '' &&
    (typeof workMode !== 'string' || !allowedWorkModes.includes(workMode))
  ) {
    return {
      success: false,
      error: 'Invalid work mode',
    };
  }

  if (!appliedAt) {
    return { success: false, error: 'Applied date is required' };
  }

  const parsedAppliedAt = new Date(String(appliedAt));

  if (Number.isNaN(parsedAppliedAt.getTime())) {
    return {
      success: false,
      error: 'Invalid applied date',
    };
  }

  const parsedFirstResponseAt = parseOptionalDate(firstResponseAt, 'first response');
  
  if (!parsedFirstResponseAt.success) {
    return { success: false, error: parsedFirstResponseAt.error };
  }

  const normalizedFirstResponseAt = status === 'APPLIED' ? null : parsedFirstResponseAt.value;

  if ((status === 'INTERVIEW' || status === 'OFFER') && normalizedFirstResponseAt == null) {
    return {
      success: false,
      error: 'First response date is required',
    };
  }

  const parsedInterviewAt = parseOptionalDate(interviewAt, 'interview');
  if (!parsedInterviewAt.success) {
    return { success: false, error: parsedInterviewAt.error };
  }

  const parsedOfferAt = parseOptionalDate(offerAt, 'offer');
  if (!parsedOfferAt.success) {
    return { success: false, error: parsedOfferAt.error };
  }
  
  const parsedRejectedAt = parseOptionalDate(rejectedAt, 'rejected');
  if (!parsedRejectedAt.success) {
    return { success: false, error: parsedRejectedAt.error };
  }

  const synchronizedMilestones = synchronizeApplicationMilestones(
    {
      firstResponseAt: normalizedFirstResponseAt ?? null,
      interviewAt: parsedInterviewAt.value ?? null,
      offerAt: parsedOfferAt.value ?? null,
      rejectedAt: parsedRejectedAt.value ?? null,
    },
    status as JobStatus,
  );

  const appliedDateOnly = toDateOnly(parsedAppliedAt);
  const firstResponseDateOnly = toDateOnly(synchronizedMilestones.firstResponseAt);
  const interviewDateOnly = toDateOnly(synchronizedMilestones.interviewAt);
  const offerDateOnly = toDateOnly(synchronizedMilestones.offerAt);
  const rejectedDateOnly = toDateOnly(synchronizedMilestones.rejectedAt);

  if (firstResponseDateOnly && appliedDateOnly && firstResponseDateOnly < appliedDateOnly) {
    return { success: false, error: 'First response cannot be before applied date' };
  }

  if (
    (status === 'INTERVIEW' || status === 'OFFER') &&
    interviewDateOnly &&
    appliedDateOnly &&
    interviewDateOnly < appliedDateOnly
  ) {
    return { success: false, error: 'Interview date cannot be before applied date' };
  }

  if (
    (status === 'INTERVIEW' || status === 'OFFER') &&
    interviewDateOnly &&
    firstResponseDateOnly &&
    interviewDateOnly < firstResponseDateOnly
  ) {
    return { success: false, error: 'Interview date cannot be before first response date' };
  }

  if (status === 'OFFER' && offerDateOnly && interviewDateOnly && offerDateOnly < interviewDateOnly) {
    return { success: false, error: 'Offer date cannot be before interview date' };
  }

  if (status === 'REJECTED' && rejectedDateOnly && appliedDateOnly && rejectedDateOnly < appliedDateOnly) {
    return { success: false, error: 'Rejected date cannot be before applied date' };
  }

  if (status === 'REJECTED' && rejectedDateOnly && firstResponseDateOnly && rejectedDateOnly < firstResponseDateOnly) {
    return { success: false, error: 'Rejected date cannot be before first response date' };
  }

  if (status === 'REJECTED' && rejectedDateOnly && interviewDateOnly && rejectedDateOnly < interviewDateOnly) {
    return { success: false, error: 'Rejected date cannot be before interview date' };
  }

  if (status === 'REJECTED' && rejectedDateOnly && offerDateOnly && rejectedDateOnly < offerDateOnly) {
    return { success: false, error: 'Rejected date cannot be before offer date' };
  }

  const parsedSalaryMin = parseOptionalNumber(salaryMin, 'minimum salary');

  if (!parsedSalaryMin.success) {
    return { success: false, error: parsedSalaryMin.error };
  }

  const parsedSalaryMax = parseOptionalNumber(salaryMax, 'maximum salary');

  if (!parsedSalaryMax.success) {
    return { success: false, error: parsedSalaryMax.error };
  }

  if (
    parsedSalaryMin.value !== undefined &&
    parsedSalaryMin.value !== null &&
    parsedSalaryMax.value !== undefined &&
    parsedSalaryMax.value !== null &&
    parsedSalaryMin.value >= parsedSalaryMax.value
  ) {
    return { success: false, error: 'Minimum salary must be less than maximum salary' };
  }

  return {
    success: true,
    data: {
      title,
      company,
      ...synchronizedMilestones,
      link: typeof link === 'string' && link.trim() ? link.trim() : null,
      salaryMin: parsedSalaryMin.value,
      salaryMax: parsedSalaryMax.value,
      location: typeof location === 'string' && location.trim() ? location.trim() : null,
      notes: typeof notes === 'string' && notes.trim() ? notes.trim() : null,
      source: source === null || source === '' ? null : source ? (source as ApplicationSource) : undefined,
      workMode: workMode === null || workMode === '' ? null : workMode ? (workMode as WorkMode) : undefined,
      appliedAt: parsedAppliedAt,
    },
  };
};
