import { api } from "../../api/api";

export const getAllResumes = () => {
  return api("api/resumes");
};

export const uploadResume = (formData: FormData) => {
  return api("api/resumes/upload", {
    method: "POST",
    body: formData
  });
};

export const updateDefaultResume = (resumeId: number | null) => {
  return api(`api/users/me/default-resume`, {
    method: "PATCH",
    body: JSON.stringify({ resumeId })
  });
};

export const deleteResume = (id: number) => {
  return api(`api/resumes/${id}`, {
    method: "DELETE"
  });
};
