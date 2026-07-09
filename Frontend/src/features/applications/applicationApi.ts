import { api } from "../../api/api";
import type { JobStatus } from "../../types/types";
import type { ApplicationValues } from "./components/ApplicationForm";

export const getAllApplications = () => {
  return api("api/applications");
};

export const getSingleApplication = (id: number) => {
  return api(`api/applications/${id}`);
};

export const getRecentApplications = () => {
  return api("api/applications/recent");
};

export const createApplication = (data: ApplicationValues) => {
  return api("api/applications", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const updateApplication = (id: number, data: ApplicationValues) => {
  return api(`api/applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

export const deleteApplication = (id: number) => {
  return api(`api/applications/${id}`, {
    method: "DELETE"
  });
};

export const updateApplicationStatus = (id: number, status: JobStatus) => {
  return api(`api/applications/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
};
