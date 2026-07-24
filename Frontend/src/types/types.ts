export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  applications: JobApplication[];
  resumes: Resume[];
  profile?: UserProfile | null;
  preferences?: UserPreferences | null;
};

export type UserProfile = {
  id: number;
  userId: number;
  user: User;
  summary?: string | null;
  title?: string | null;
  location?: string | null;
  website?: string | null;
  linkedin?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type JobApplication = {
  id: number;
  publicId: string;
  title: string;
  company: string;
  location?: string | null;
  status: JobStatus;
  appliedAt: string;
  notes?: string | null;
  link?: string | null;
  source?: ApplicationSource | null;
  workMode?: WorkMode | null;
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

export type UserPreferences = {
  id: number;
  userId: number;
  publicProfileEnabled: boolean;
  autoStatusUpdatesEnabled: boolean;
  themePreference: "light" | "dark" | "system";
  createdAt: string;
  updatedAt: string;
};

export type UpdatePreferencesValues = {
  publicProfileEnabled: boolean;
  autoStatusUpdatesEnabled: boolean;
  themePreference: "light" | "dark" | "system";
};

export type ApplicationActivity = {
  id: number;
  type: "CREATED" | "UPDATED" | "STATUS_CHANGE" | "DELETED";
  title: string;
  company: string;
  fromStatus?: JobStatus | null;
  toStatus?: JobStatus | null;
  createdAt: string;
  applicationId?: number | null;
  userId: number;
}