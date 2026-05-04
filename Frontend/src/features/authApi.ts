import { api } from "../api/api";
import type { RegistrationValues } from "../components/ui/RegistrationForm";

export const register = (data: RegistrationValues) => {
    return api("api/auth/register", { method: "POST", body: JSON.stringify(data) });
  
};