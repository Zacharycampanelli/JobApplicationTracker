import { api } from '../../api/api';

export const getUserRecentActivities = async () => {
  return api('api/activities/recent')
};