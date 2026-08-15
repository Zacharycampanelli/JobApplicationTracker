import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import { z } from "zod";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { resetPassword } from "../authApi";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your password")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const PasswordResetForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [requestError, setRequestError] = useState("");

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setRequestError("");

    if (!token) {
      setRequestError("This password reset link is invalid");
      return;
    }

    try {
      await resetPassword({ token, password: data.password });
      navigate("/login", {
        replace: true,
        state: { message: "Your password has been reset. Please log in." }
      });
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : "Unable to reset password"
      );
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-label-md text-error">
          This password reset link is missing its token.
        </p>

        <Link to="/forgot-password" className="text-primary hover:underline">
          Request another reset link
        </Link>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="password"
        {...register("password")}
        label="NEW PASSWORD"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
      />

      <Input
        id="confirmPassword"
        {...register("confirmPassword")}
        label="CONFIRM PASSWORD"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
      />

      {requestError && (
        <p className="text-label-md text-error" role="alert">
          {requestError}
        </p>
      )}

      <Button
        className="mt-2 w-full"
        size="lg"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Resetting..." : "Reset password"}
      </Button>
    </form>
  );
};

export default PasswordResetForm;
