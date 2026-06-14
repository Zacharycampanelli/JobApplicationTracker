export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  applications: JobApplication[];
  resumes: Resume[];
};

export type JobApplication = {
  id: number;
  title: string;
  company: string;
  location?: string | null;
  status: JobStatus;
  appliedAt: string;
  notes?: string | null;
  link?: string | null;
  source?: ApplicationSource;
  workMode?: WorkMode;
  resumeId?: number | null;
  resume?: Resume | null;
  userId: number;
  user?: User;
  salaryMin?: number | null;
  salaryMax?: number | null;
  firstResponseAt?: string | null;
  interviewAt?: string | null;
  offerAt?: string | null;
  rejectedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type JobStatus = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

export type Resume = {
  id: number;
  name: string;
  fileUrl: string;
  mimeType: string;
  userId: number;
  user: User;
  applications: JobApplication[];
  createdAt: string;
};

export const statusClassMap: Record<string, string> = {
  APPLIED: "status-applied",
  INTERVIEW: "status-interview",
  OFFER: "status-offer",
  REJECTED: "status-rejected"
};

export type ApplicationSource =
  | "LINKEDIN"
  | "INDEED"
  | "COMPANY_SITE"
  | "REFERRAL"
  | "RECRUITER"
  | "NETWORKING"
  | "OTHER";

export type WorkMode = "REMOTE" | "HYBRID" | "ONSITE";
