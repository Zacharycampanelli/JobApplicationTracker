import Header from "../components/layout/Header";
import { useBreakpoint } from "../utils/useBreakpoint";
import { useAuthContext } from "../context/AuthContext";
import Input from "../components/ui/Input";
import { updateProfile } from "../features/profile/profileApi";
import type { Resume } from "../types/types";
import z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import CancelModal from "../components/shared/CancelModal";
import Save from "../assets/images/save.svg?react";
import Edit from "../assets/images/edit.svg?react";
import ResumeManager from "../features/resumes/components/ResumeManager";
import { getAllResumes } from "../features/resumes/resumeApi";
import { optionalNumber } from "../utils/zodUtils";
import SuccessModal from "../components/shared/SuccessModal";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  resumeId: optionalNumber
});

type ProfileFormValues = z.input<typeof profileSchema>;
type ProfileValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, updateUser } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue
  } = useForm<ProfileFormValues, unknown, ProfileValues>({
    resolver: zodResolver(profileSchema)
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState(true);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);

  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;
  const loadResumes = async () => {
    setIsLoading(true);

    try {
      const data = await getAllResumes();
      setResumes(data);
      setEmpty(data.length === 0);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resumes");
      setEmpty(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  useEffect(() => {
    reset({ name: user?.name ?? "", resumeId: undefined });
  }, [user, reset]);

  const onSubmit = async (data: ProfileValues) => {
    try {
      const updatedUser = await updateProfile(data);
      updateUser(updatedUser);
      setInEditMode(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const enterEditMode = () => {
    setInEditMode(true);
  };

  const requestExitEditMode = () => {
    setIsCancelModalOpen(true);
  };

  const exitEditMode = () => {
    reset({ name: user?.name ?? "", resumeId: undefined });
    setInEditMode(false);
    setIsCancelModalOpen(false);
  };

  const toggleEditMode = () => {
    if (inEditMode) {
      requestExitEditMode();
    } else {
      enterEditMode();
    }
  };
  const selectedResumeId = useWatch({ control, name: "resumeId" });

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4 md:relative">
      {isMobile && <Header />}
      <h2 className="mt-6 mb-6 text-page-title text-on-surface">
        Professional Portfolio
      </h2>

      <div className="flex items-center justify-between">
        <p className="text-body-lg text-on-surface-secondary">
          Manage your digital identity and career assets.
        </p>

        <Button
          type="button"
          variant={inEditMode ? "primary" : "secondary"}
          onClick={() => toggleEditMode()}
          className="size-12 absolute right-8 p-3"
        >
          <Edit
            width={36}
            height={36}
            fill={inEditMode ? "white" : "#4c56af"}
          />
        </Button>
      </div>

      <div className="mt-8 grid gap-6">
        <span className="size-28 rounded-full bg-black " />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="name"
            label="FULL NAME "
            {...register("name")}
            defaultValue={user?.name}
            error={errors.name?.message}
            disabled={!inEditMode}
          />

          <Input
            id="email"
            label="EMAIL ADDRESS"
            defaultValue={user?.email}
            disabled={true}
          />
          <span className={`${inEditMode ? "flex" : "hidden"}`}>
            <Button icon={<Save />} type="submit" disabled={isSubmitting}>
              Save Changes
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={requestExitEditMode}
            >
              Cancel
            </Button>
          </span>
            <SuccessModal
              isOpen={isSuccessModalOpen}
              onClose={() => setIsSuccessModalOpen(false)}
            />
            <CancelModal
              isOpen={isCancelModalOpen}
              onClose={() => setIsCancelModalOpen(false)}
              onConfirm={exitEditMode}
            />
          <ResumeManager
            resumes={resumes}
            isLoading={isLoading}
            error={error}
            empty={empty}
            selectedResumeId={
              typeof selectedResumeId === "number"
                ? selectedResumeId
                : undefined
            }
            onSelectResume={(resumeId) =>
              setValue("resumeId", resumeId, {
                shouldDirty: true,
                shouldValidate: true
              })
            }
            onResumesChanged={loadResumes}
          />
        </form>
      </div>
    </div>
  );
};

export default Profile;
