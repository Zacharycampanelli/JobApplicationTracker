import { api } from "../api/api";
import type { AddApplicationValues } from "../components/ui/AddApplicatiolnForm";

export const getAllApplications = () => {
  return api("api/applications");
};

export const createApplication = (data: AddApplicationValues) => {
  return api("api/applications", {
    method: "POST",
    body: JSON.stringify(data)
  });
};
