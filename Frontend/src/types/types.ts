export type User = {
  id: number;
  name: string;
  email: string;
  applications: JobApplication[];
  createdAt: string;
  updatedAt: string;
}

export type JobApplication = {
  id: number;
  title: string;
  company: string;
  status: JobStatus;
  appliedAt: string;
  notes?: string | null;
  link?: string | null;
  userId: number;
  user?: User;
}

export type JobStatus = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";
