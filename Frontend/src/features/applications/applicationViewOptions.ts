import type { JobStatus } from "../../types/types";

export const SORT_METHODS = ["Newest", "Oldest", "Title", "Company"] as const;
export type SortMethod = (typeof SORT_METHODS)[number];

export const STATUS_FILTERS = [
  "All",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected"
] as const;

export type StatusFilter = (typeof STATUS_FILTERS)[number];

export const STATUS_BY_FILTER: Partial<Record<StatusFilter, JobStatus>> = {
  Applied: "APPLIED",
  Interviewing: "INTERVIEW",
  Offer: "OFFER",
  Rejected: "REJECTED"
};
