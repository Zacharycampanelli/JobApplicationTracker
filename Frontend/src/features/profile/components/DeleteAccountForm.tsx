import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useAuthContext } from "../../../context/AuthContext";
import { deleteAccount } from "../../auth/authApi";

const deleteAccountFormSchema = z
  .object({
    password: z.string().min(1, "Password is required")
  })

type DeleteAccountFormValues = z.infer<typeof deleteAccountFormSchema>;

const DeleteAccountForm = () => {
  const { logout } = useAuthContext();
  const [requestError, setRequestError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountFormSchema),
    defaultValues: {
      password: ""
    }
  });

  const onSubmit = async (data: DeleteAccountFormValues) => {
    setRequestError("");

    try {
      const result = await deleteAccount({
        password: data.password
      });

      logout(result.message)
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : "Unable to delete account"
      );
    }
  };

  return (
  <>
    <h2 className="mb-4 text-heading-sm text-danger font-bold text-center">*** Danger Zone ***</h2>
    <p className="mb-4 text-body-sm text-danger">Deleting your account will permanently remove all your data.</p>
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="deleteAccountPassword"
        {...register("password")}
        label="CURRENT PASSWORD"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
      />

      {requestError && (
        <p className="text-label-md text-error" role="alert">
          {requestError}
        </p>
      )}

      <Button
        className="mt-2 w-full"
        variant="danger"
        size="lg"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Deleting Account..." : "Delete Account Permanently"}
      </Button>
    </form>
  </>
  );
};

export default DeleteAccountForm;
