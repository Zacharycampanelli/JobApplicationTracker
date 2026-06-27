import { api } from "../../api/api";
import type { UpdatePreferencesValues } from "../../types/types";

export type UpdateProfileValues = {
  name: string;
  summary?: string;
  title?: string;
  location?: string;
  website?: string | null;
  linkedin?: string | null;
};

export const updateProfile = (data: UpdateProfileValues) => {
  return api("api/users/me", {
    method: "PATCH",
    body: JSON.stringify(data)
  });
};

export const uploadProfileImage = (formData: FormData) => {
  return api("api/users/me/avatar", {
    method: "PATCH",
    body: formData
  });
};

export const updateUserPreferences = (data: UpdatePreferencesValues ) => {
  return api("api/users/me/preferences", {
    method: "PATCH",
    body: JSON.stringify(data)
  });
};