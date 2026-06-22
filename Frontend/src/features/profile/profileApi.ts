import { api } from "../../api/api";

export type UpdateProfileValues = {
    name: string;
}

export const updateProfile = (data: UpdateProfileValues) => {
  return api("api/users/me", {
    method: "PATCH",
    body: JSON.stringify(data)
  });
};