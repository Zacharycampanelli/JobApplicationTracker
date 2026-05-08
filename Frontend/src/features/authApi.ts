import { api } from "../api/api";
import type { LoginValues } from "../components/ui/LoginForm";
import type { RegistrationValues } from "../components/ui/RegistrationForm";

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
  return api("api/auth/me")
}