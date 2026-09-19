import { z } from "zod";

const registrationRequiredMessage = "Name, email and password are required";

export const registrationSchema = z.object({
  name: z
    .string({ error: registrationRequiredMessage })
    .trim()
    .min(1, registrationRequiredMessage)
    .min(2, "Name must be at least 2 characters long"),
  email: z
    .string({ error: registrationRequiredMessage })
    .trim()
    .min(1, registrationRequiredMessage)
    .email("Enter a valid email address"),
  password: z
    .string({ error: registrationRequiredMessage })
    .min(1, registrationRequiredMessage)
    .min(15, "Password must be at least 15 characters long"),
});

const loginRequiredMessage = "Email and password are required";

export const loginSchema = z.object({
  email: z
    .string({ error: loginRequiredMessage })
    .trim()
    .min(1, loginRequiredMessage)
    .email("Enter a valid email address"),
  password: z.string({ error: loginRequiredMessage }).min(1, loginRequiredMessage),
});

const forgotPasswordRequiredMessage = "Email is required";

export const forgotPasswordSchema = z.object({
  email: z
    .string({ error: forgotPasswordRequiredMessage })
    .trim()
    .min(1, forgotPasswordRequiredMessage)
    .email("Enter a valid email address"),
});

const resetPasswordRequiredMessage = "Token and password are required";

export const resetPasswordSchema = z.object({
  token: z.string({ error: resetPasswordRequiredMessage }).min(1, resetPasswordRequiredMessage),
  password: z
    .string({ error: resetPasswordRequiredMessage })
    .min(1, resetPasswordRequiredMessage)
    .min(15, "Password must be at least 15 characters long"),
});

const changePasswordRequiredMessage = "Password is required";

export const changePasswordSchema = z.object({
  oldPassword: z.string({ error: changePasswordRequiredMessage })
  newPassword: z.string({ error: changePasswordRequiredMessage }).min(1, changePasswordRequiredMessage).min(15, "New password must be at least 15 characters long"),
});
