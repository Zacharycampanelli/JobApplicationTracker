import { api } from "../api/api";
import type { ApplicationValues } from "../components/ui/ApplicationForm";

export const getAllApplications = () => {
  return api("api/applications");
};

export const getSingleApplication = (id: number) => {
  return api(`api/applications/${id}`);
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
