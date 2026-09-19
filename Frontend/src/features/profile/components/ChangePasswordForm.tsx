import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useAuthContext } from "../../../context/AuthContext";
import { changePassword } from "../profileApi";

const changePasswordFormSchema = z
  .object({
    oldPassword: z.string().min(1, "Enter your old password"),
    password: z.string().min(15, "Password must be at least 15 characters"),
    confirmPassword: z.string().min(1, "Confirm your password")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

const ChangePasswordForm = () => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const [requestError, setRequestError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setRequestError("");

    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.password,
      });

      logout();
      navigate("/login", {
        replace: true,
        state: { message: "Your password has been changed. Please log in." }
      });
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : "Unable to change password"
      );
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="oldPassword"
        {...register("oldPassword")}
        label="OLD PASSWORD"
        type="password"
        placeholder="••••••••"
        error={errors.oldPassword?.message}
      />
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
        {isSubmitting ? "Changing..." : "Change password"}
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
