import Button from "./Button";
import Input from "./Input";
import Link from "../../assets/images/link.svg?react";
import ResumeSelect from "./ResumeSelect";
import Select from "./Select";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resume } from "../../types/types";
import { useState } from "react";

const applicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
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
  onSubmit: (values: ApplicationValues) => Promise<void>;
  onCancel: () => void;
  newOrEdit: "new" | "edit";
  defaultValues?: Partial<ApplicationFormValues>;
};

const ApplicationForm = ({
  resumes,
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
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
        label="STATUS"
        type="date"
        placeholder="e.g. 2022-01-01"
        error={errors.appliedAt?.message}
      />
      <Input
        id="notes"
        {...register("notes")}
        label="NOTES"
        placeholder="Document interview highlights, referral contacts, or preparation notes..."
        error={errors.notes?.message}
      />
      <Input
        id="link"
        {...register("link")}
        label="JOB LINK/ URL"
        placeholder="LINK"
        error={errors.link?.message}
        startIcon={<Link />}
      />
      <ResumeSelect
        resumes={resumes}
        selectedResumeId={selectedResumeId}
        onSelectResume={(resumeId) =>
          setValue("resumeId", resumeId, {
            shouldDirty: true,
            shouldValidate: true
          })
        }
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Submitting..."
          : newOrEdit === "new"
            ? "Add Application"
            : "Update Application"}
      </Button>
      <Button type="button" variant="danger" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
};

export default ApplicationForm;
