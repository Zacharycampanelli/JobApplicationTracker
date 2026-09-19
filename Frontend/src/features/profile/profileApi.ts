import { api } from "../../api/api";
import type { UpdatePasswordValues, UpdatePreferencesValues, UpdateProfileValues } from "../../types/types";



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

export const changePassword = (data: UpdatePasswordValues) => {
  return api("api/auth/change-password", {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export const getPublicProfile = (id: number) => {
  return api(`api/public/profiles/${id}`);
};