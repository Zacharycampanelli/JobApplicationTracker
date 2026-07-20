import { api } from "../../api/api";
import type { LoginValues } from "../auth/components/LoginForm";
import type { RegistrationValues } from "../auth/components/RegistrationForm";

export const register = (data: RegistrationValues) => {
  return api("api/auth/register", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const login = (data: LoginValues) => {
  return api("api/auth/login", { method: "POST", body: JSON.stringify(data) });
};

export const getMe = () => {
  return api("api/auth/me");
};

export const forgotPassword = (data: { email: string }) => {
  return api("api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const resetPassword = (data: { token: string; password: string }) => {
  return api("api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data)
  });
};