import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Email from "../../../assets/images/email.svg?react";
import { forgotPassword } from "../authApi";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address")
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const [message, setMessage] = useState("");
  const [requestError, setRequestError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setMessage("");
    setRequestError("");

    try {
      const res = await forgotPassword(data);
      setMessage(
        res.message ??
          "If an account exists for that email, a reset link has been sent."
      );
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Unable to request a password reset"
      );
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="email"
        {...register("email")}
        label="EMAIL ADDRESS"
        type="email"
        placeholder="user@example.com"
        endIcon={<Email />}
        error={errors.email?.message}
      />
      {message && (
        <p className="text-label-md text-primary" role="status">
          {message}
        </p>
      )}
      {requestError && (
        <p className="text-label-md text-error" role="status">
          {requestError}
        </p>
      )}

      <Button
        className="mt-2 w-full"
        size="lg"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
