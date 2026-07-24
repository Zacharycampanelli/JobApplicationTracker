import { api } from "../../api/api";
import type { ApplicationActivity } from "../../types/types";

export const getUserRecentActivities = async (): Promise<ApplicationActivity[]> => {
  return api("api/activities/recent");
};
