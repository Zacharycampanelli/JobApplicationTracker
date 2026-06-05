import Input from "../../../components/ui/Input";
import Link from "../../../assets/images/link.svg?react";
import ResumeManager from "../../resumes/components/ResumeManager";
import Select from "../../../components/ui/Select";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resume } from "../../../types/types";
import Textarea from "../../../components/ui/Textarea";
import ApplicationFormActions from "./ApplicationFormActions";

const applicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  status: z.enum(["APPLIED", "INTERVIEW", "REJECTED", "OFFER"]),
  appliedAt: z.coerce.date().optional(),
  notes: z.string().optional(),
  link: z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;
      const trimmedValue = value.trim();
      if (!trimmedValue) return "";
      if (/^https?:\/\//i.test(trimmedValue)) {
        return trimmedValue;
      }
      return `https://${trimmedValue}`;
    },
    z.string().url("Invalid URL").optional().or(z.literal(""))
  ),
  resumeId: z.number().optional()
});

type ApplicationFormValues = z.input<typeof applicationSchema>;
export type ApplicationValues = z.output<typeof applicationSchema>;

type ApplicationFormProps = {
  resumes: Resume[];
  isLoadingResumes: boolean;
  resumeError: string;
  emptyResumes: boolean;
  onResumesChanged: () => void;
  onSubmit: (values: ApplicationValues) => Promise<void>;
  onCancel: () => void;
  newOrEdit: "new" | "edit";
  defaultValues?: Partial<ApplicationFormValues>;
};

const ApplicationForm = ({
  resumes,
  isLoadingResumes,
  resumeError,
  emptyResumes,
  onResumesChanged,
  onSubmit,
  onCancel,
  newOrEdit,
  defaultValues
}: ApplicationFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm<ApplicationFormValues, unknown, ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues
  });

  const selectedResumeId = useWatch({ control, name: "resumeId" });

  return (
    <form
      className="flex flex-col gap-4 md:grid md:grid-cols-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        id="company"
        {...register("company")}
        label="COMPANY NAME"
        placeholder="e.g. Google"
        error={errors.company?.message}
      />
      <Input
        id="title"
        {...register("title")}
        label="JOB TITLE"
        placeholder="e.g. Software Engineer"
        error={errors.title?.message}
      />
      <Input
        id="location"
        {...register("location")}
        label="JOB LOCATION"
        placeholder="e.g. Austin, TX or Remote"
        error={errors.location?.message}
      />
      <Select
        id="status"
        {...register("status")}
        name="status"
        label="STATUS"
        options={[
          { value: "APPLIED", label: "APPLIED" },
          { value: "INTERVIEW", label: "INTERVIEW" },
          { value: "REJECTED", label: "REJECTED" },
          { value: "OFFER", label: "OFFER" }
        ]}
        error={errors.status?.message}
      ></Select>
      <Input
        id="appliedAt"
        {...register("appliedAt")}
        label="DATE APPLIED"
        type="date"
        placeholder="e.g. 2022-01-01"
        error={errors.appliedAt?.message}
      />
      <Input
        id="link"
        {...register("link")}
        label="JOB LINK/ URL"
        placeholder="LINK"
        error={errors.link?.message}
        startIcon={<Link />}
      />
      <div className="md:col-span-2 md:mb-4">
        <Textarea
          id="notes"
          {...register("notes")}
          label="NOTES"
          rows={4}
          placeholder="Document interview highlights, referral contacts, or preparation notes..."
          error={errors.notes?.message}
          className="md:col-span-2"
        />
      </div>
      <ResumeManager
        isLoading={isLoadingResumes}
        error={resumeError}
        empty={emptyResumes}
        resumes={resumes}
        selectedResumeId={selectedResumeId}
        onSelectResume={(resumeId) =>
          setValue("resumeId", resumeId, {
            shouldDirty: true,
            shouldValidate: true
          })
        }
        onResumesChanged={onResumesChanged}
      />
      <div className="flex flex-col gap-3 justify-between md:hidden">
        <ApplicationFormActions
          isSubmitting={isSubmitting}
          newOrEdit={newOrEdit}
          onCancel={onCancel}
        />
      </div>
      <div className="hidden md:flex md:flex-row md:col-span-2 justify-between md:absolute md:right-8 md:top-10 md:gap-4">
        <ApplicationFormActions
          isSubmitting={isSubmitting}
          newOrEdit={newOrEdit}
          onCancel={onCancel}
        />
      </div>
    </form>
  );
};

export default ApplicationForm;
