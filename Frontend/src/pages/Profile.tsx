import Header from "../components/layout/Header";
import { useBreakpoint } from "../utils/useBreakpoint";
import { useAuthContext } from "../context/AuthContext";
import Input from "../components/ui/Input";
import {
  updateProfile,
  uploadProfileImage
} from "../features/profile/profileApi";
import type { Resume } from "../types/types";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import CancelModal from "../components/shared/CancelModal";
import Save from "../assets/images/save.svg?react";
import ResumeManager from "../features/resumes/components/ResumeManager";
import { getAllResumes } from "../features/resumes/resumeApi";
import { optionalNumber, optionalText, optionalUrl } from "../utils/zodUtils";
import Textarea from "../components/ui/Textarea";
import { API_URL } from "../api/api";
import UserPreferences from "../features/profile/components/UserPreferences";
import SharedProfileView from "../features/profile/components/SharedProfileView";
import AccountOwnerDetails from "../features/profile/components/AccountOwnerDetails";
import { toast } from "sonner";
import LoadingState from "../components/shared/LoadingState";
import ErrorState from "../components/shared/ErrorState";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  summary: optionalText,
  title: optionalText,
  location: optionalText,
  website: optionalUrl,
  linkedin: optionalUrl,
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
    setValue
  } = useForm<ProfileFormValues, unknown, ProfileValues>({
    resolver: zodResolver(profileSchema)
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState(true);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);

  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;

  const avatarSrc = user?.profile?.avatarUrl
    ? `${API_URL}${user.profile.avatarUrl}`
    : undefined;

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
    reset({
      name: user?.name ?? "",
      summary: user?.profile?.summary ?? "",
      title: user?.profile?.title ?? "",
      location: user?.profile?.location ?? "",
      website: user?.profile?.website ?? "",
      linkedin: user?.profile?.linkedin ?? "",
      resumeId: undefined
    });
  }, [user, reset]);

  const onSubmit = async (data: ProfileValues) => {
    try {
      const { resumeId, ...profileData } = data;
      const updatedUser = await updateProfile(profileData);
      updateUser(updatedUser);
      setInEditMode(false);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  };

  const enterEditMode = () => {
    setInEditMode(true);
  };

  const requestExitEditMode = () => {
    setIsCancelModalOpen(true);
  };

  const exitEditMode = () => {
    reset({
      name: user?.name ?? "",
      resumeId: undefined,
      summary: user?.profile?.summary ?? "",
      title: user?.profile?.title ?? "",
      location: user?.profile?.location ?? "",
      website: user?.profile?.website ?? "",
      linkedin: user?.profile?.linkedin ?? ""
    });
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

  const handleUrl = (url: string) => {
    if (!url.trim()) return "";

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `http://${url}`;
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const updatedUser = await uploadProfileImage(formData);
      updateUser(updatedUser);
      toast.success("Profile image updated!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile image"
      );
    }
  };
  if (isLoading) return <LoadingState message="Loading profile..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface py-4 md:relative md:px-6">
      {isMobile && <Header />}

      <main className="flex flex-col gap-6 pb-10 md:gap-8">
        <header className="mt-6 flex flex-col gap-3">
          <h1 className="text-page-title text-on-surface">
            Professional Portfolio
          </h1>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-body-lg text-on-surface-secondary">
              Manage your digital identity and career assets.
            </p>

            <Button
              type="button"
              variant={inEditMode ? "primary" : "secondary"}
              onClick={toggleEditMode}
              className="shrink-0"
            >
              {inEditMode ? "Cancel" : "Edit"}
            </Button>
          </div>
        </header>
        {inEditMode ? (
          <>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={`${user?.name ?? "User"} avatar`}
                className="size-28 mx-auto my-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex justify-center items-center size-28 mx-auto my-8 rounded-full bg-surface-container-high text-page-title text-on-surface">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </span>
            )}

            <form
              className="mt-4 flex flex-col gap-6 md:grid md:grid-cols-2 xl:grid-cols-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="md:col-span-2 xl:col-span-3">
                <span className="text-label-md text-on-surface">
                  PROFILE IMAGE
                </span>

                <label
                  htmlFor="avatar"
                  className="mt-2 flex h-10 cursor-pointer items-center justify-center rounded-control bg-surface-container-low text-body-md text-on-surface"
                >
                  Select a new image
                </label>
                <Input
                  type="file"
                  id="avatar"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarUpload}
                  className="sr-only"
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <span className="text-label-md text-on-surface">
                  ACCOUNT EMAIL
                </span>
                <p className="flex h-10 w-full items-center rounded-control bg-surface-container-low px-3 text-body-md text-on-surface-variant">
                  {user?.email}
                </p>
              </div>
              <Input
                id="name"
                label="FULL NAME "
                {...register("name")}
                defaultValue={user?.name}
                error={errors.name?.message}
                className={!inEditMode ? "mx-auto" : undefined}
              />

              <Input
                id="email"
                label="EMAIL ADDRESS"
                defaultValue={user?.email}
                disabled={true}
              />
              <Input
                id="title"
                label="TITLE"
                {...register("title")}
                defaultValue={user?.profile?.title ?? undefined}
                error={errors.title?.message}
              />
              <Input
                id="location"
                label="LOCATION"
                {...register("location")}
                defaultValue={user?.profile?.location ?? undefined}
                error={errors.location?.message}
              />
              <Input
                id="website"
                label="WEBSITE"
                defaultValue={user?.profile?.website ?? undefined}
                error={errors.website?.message}
                {...register("website", {
                  onBlur: (e) => {
                    setValue("website", handleUrl(e.target.value), {
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }
                })}
              />
              <Input
                id="linkedin"
                label="LINKEDIN"
                defaultValue={user?.profile?.linkedin ?? undefined}
                error={errors.linkedin?.message}
                {...register("linkedin", {
                  onBlur: (e) => {
                    setValue("linkedin", handleUrl(e.target.value), {
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }
                })}
              />
              <div className="md:col-span-2 xl:col-span-3">
                <Textarea
                  id="summary"
                  label="SUMMARY"
                  {...register("summary")}
                  defaultValue={user?.profile?.summary ?? undefined}
                  error={errors.summary?.message}
                  className="md:col-span-2 xl:col-span-3"
                />
              </div>
              <span className="flex flex-col w-full gap-4 justify-around md:flex-row md:col-span-2 xl:col-span-3">
                <Button
                  icon={<Save />}
                  type="submit"
                  disabled={isSubmitting}
                  className="md:w-48 xl:w-56"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={requestExitEditMode}
                  className="md:w-48 xl:w-56"
                >
                  Cancel
                </Button>
              </span>
            </form>
          </>
        ) : (
          <SharedProfileView
            email={user?.email ?? ""}
            name={user?.name ?? ""}
            avatarUrl={avatarSrc}
            title={user?.profile?.title}
            location={user?.profile?.location}
            website={user?.profile?.website}
            linkedin={user?.profile?.linkedin}
            summary={user?.profile?.summary}
          />
        )}

        <AccountOwnerDetails
          email={user?.email ?? ""}
          createdAt={user?.createdAt ?? ""}
          updatedAt={user?.updatedAt ?? ""}
        />

        <ResumeManager
          resumes={resumes}
          isLoading={isLoading}
          error={error}
          empty={empty}
          onResumesChanged={loadResumes}
        />
        <UserPreferences />
      </main>

      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={exitEditMode}
      />
    </div>
  );
};

export default Profile;
