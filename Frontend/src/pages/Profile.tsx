import Header from "../components/layout/Header";
import { useBreakpoint } from "../utils/useBreakpoint";
import { useAuthContext } from "../context/AuthContext";
import Input from "../components/ui/Input";
import { updateProfile } from "../features/profile/profileApi";
import type { User } from "../types/types";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Save from "../assets/images/save.svg?react";
import CancelModal from "../components/shared/CancelModal";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters")
});

type ProfileValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, updateUser } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || ""
    }
  });

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;

  useEffect(() => {
    reset({ name: user?.name ?? "" });
  }, [user, reset]);

  const onSubmit = async (data: ProfileValues) => {
    try {
      const updatedUser = await updateProfile(data);
      updateUser(updatedUser);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4 md:relative">
      {isMobile && <Header />}
      <h2 className="mt-6 mb-6 text-page-title text-on-surface">
        Professional Portfolio
      </h2>

      <p className="mt-4 text-body-lg text-on-surface-secondary">
        Manage your digital identity and career assets.
      </p>

      <div className="mt-8 grid gap-6">
        <span className="size-28 rounded-full bg-black " />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Button icon={<Save />} type="submit" disabled={isSubmitting}>
            Save Changes
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsCancelModalOpen(true)}
          >
            Cancel
          </Button>
          <CancelModal
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            newLocation="/"
          />

          <Input
            id="name"
            label="FULL NAME "
            {...register("name")}
            defaultValue={user?.name}
            error={errors.name?.message}
          />

          <Input
            id="email"
            label="EMAIL ADDRESS"
            disabled
            defaultValue={user?.email}
          />
        </form>
      </div>
    </div>
  );
};

export default Profile;
