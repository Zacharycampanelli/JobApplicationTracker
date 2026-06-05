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

export const deleteResume = (id: number) => {
  return api(`api/resumes/${id}`, {
    method: "DELETE"
  });
};
