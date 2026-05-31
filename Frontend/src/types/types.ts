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
  resumeId?: number | null;
  resume?: Resume | null;
  userId: number;
  user?: User;
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
