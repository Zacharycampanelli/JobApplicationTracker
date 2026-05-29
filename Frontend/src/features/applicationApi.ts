import { api } from "../api/api";
import type { ApplicationValues } from "../components/ui/ApplicationForm";

export const getAllApplications = () => {
  return api("api/applications");
};

export const createApplication = (data: ApplicationValues) => {
  return api("api/applications", {
    method: "POST",
    body: JSON.stringify(data)
  });
};
