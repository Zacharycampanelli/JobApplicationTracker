import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./Input";
import Button from "./Button";

import { register as registerUser } from "../../features/authApi";

import Person from "../../assets/images/person.svg?react";
import Email from "../../assets/images/email.svg?react";
import SideArrow from "../../assets/images/sidearrow.svg?react";

const registrationSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export type RegistrationValues = z.infer<typeof registrationSchema>;

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: RegistrationValues) => {
    try {
      const res = await registerUser(data);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="name"
        {...register("name")}
        label="FULL NAME"
        placeholder="Joe Smith"
        endIcon={<Person />}
        error={errors.name?.message}
      />
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
      <Input
        id="confirmPassword"
        {...register("confirmPassword")}
        label="CONFIRM"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
      />

      <div className="mt-2 flex">
        <Button
          className="w-full"
          size="lg"
          type="submit"
          disabled={isSubmitting}
        >
          Create account <SideArrow />
        </Button>
      </div>
    </form>
  );
};

export default RegistrationForm;
