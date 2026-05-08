import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./Input";
import Button from "./Button";

import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import Email from "../../assets/images/email.svg?react";
import { useNavigate } from "react-router";

const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required")
});

export type LoginValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const onSubmit = async (data: LoginValues) => {
    setLoginError("");
    try {
      const res = await loginUser(data);
      login(res.user, res.token);
      navigate("/", { replace: true });
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Invalid email or password"
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
        placeholder="joe@ledger.io"
        endIcon={<Email />}
        error={errors.email?.message}
      />
      <Input
        id="password"
        {...register("password")}
        label="PASSWORD"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
      />
      {loginError && <p className="text-label-md text-error">{loginError}</p>}

      <div className="mt-2 flex">
        <Button
          className="w-full"
          size="lg"
          type="submit"
          disabled={isSubmitting}
        >
          Sign in to Dashboard
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
