import { api } from "../api/api";

export const getAllApplications = () => {
  return api("api/applications");
};