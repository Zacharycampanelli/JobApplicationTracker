import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import Link from "../../../assets/images/link.svg?react";
import ExpandableSection from "../../../components/shared/ExpandableSection";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";
import type { Resume } from "../../../types/types";
import {
  optionalNumber,
  optionalText,
  optionalDate,
  requiredDate
} from "../../../utils/zodUtils";
import ResumeManager from "../../resumes/components/ResumeManager";
import AdditionalFormOptions from "./AdditionalFormOptions";
import ApplicationFormActions from "./ApplicationFormActions";

const applicationSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    company: z.string().min(1, "Company is required"),
    location: optionalText,
    status: z.enum(["APPLIED", "INTERVIEW", "REJECTED", "OFFER"]),
    appliedAt: requiredDate,
    notes: optionalText,
    link: z.preprocess(
      (value) => {
        if (value === null || value === undefined) return "";
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
    source: z
      .enum([
        "LINKEDIN",
        "INDEED",
        "COMPANY_SITE",
        "REFERRAL",
        "RECRUITER",
        "NETWORKING",
        "OTHER"
      ])
      .nullish(),
    workMode: z.enum(["REMOTE", "HYBRID", "ONSITE"]).nullish(),
    salaryMin: optionalNumber,
    salaryMax: optionalNumber,
    firstResponseAt: optionalDate,
    interviewAt: optionalDate,
    offerAt: optionalDate,
    rejectedAt: optionalDate,
    resumeId: optionalNumber
  })
  .refine(
    (data) =>
      data.salaryMin == null ||
      data.salaryMax == null ||
      data.salaryMin < data.salaryMax,
    {
      message: "Salary range is invalid",
      path: ["salaryMax"]
    }
  )
  .refine(
    (data) =>
      (data.status !== "INTERVIEW" && data.status !== "OFFER") ||
      data.firstResponseAt != null,
    {
      message: "First response date is required",
      path: ["firstResponseAt"]
    }
  )
  .superRefine((data, ctx) => {
    if (
      data.status !== "APPLIED" &&
      data.firstResponseAt &&
      data.firstResponseAt < data.appliedAt
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["firstResponseAt"],
        message: "First response date cannot be before applied date"
      });
    }
    if (
      (data.status === "INTERVIEW" || data.status === "OFFER") &&
      data.interviewAt &&
      data.firstResponseAt &&
      data.interviewAt < data.firstResponseAt
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["interviewAt"],
        message: "Interview date cannot be before first response date"
      });
    }

    if (
      data.status === "OFFER" &&
      data.offerAt &&
      data.interviewAt &&
      data.offerAt < data.interviewAt
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["offerAt"],
        message: "Offer date cannot be before interview date"
      });
    }

    if (
      data.status === "REJECTED" &&
      data.rejectedAt &&
      data.appliedAt &&
      data.rejectedAt < data.appliedAt
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["rejectedAt"],
        message: "Rejected date cannot be before applied date"
      });
    }

    if (
      data.status === "REJECTED" &&
      data.rejectedAt &&
      data.firstResponseAt &&
      data.rejectedAt < data.firstResponseAt
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["rejectedAt"],
        message: "Rejected date cannot be before first response date"
      });
    }

    if (
      data.status === "REJECTED" &&
      data.rejectedAt &&
      data.interviewAt &&
      data.rejectedAt < data.interviewAt
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["rejectedAt"],
        message: "Rejected date cannot be before interview date"
      });
    }

    if (
      data.status === "REJECTED" &&
      data.rejectedAt &&
      data.offerAt &&
      data.rejectedAt < data.offerAt
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["rejectedAt"],
        message: "Rejected date cannot be before offer date"
      });
    }
  });
export type ApplicationFormValues = z.input<typeof applicationSchema>;
export type ApplicationValues = z.output<typeof applicationSchema>;

type ApplicationFormProps = {
  resumes: Resume[];
  isLoadingResumes: boolean;
  resumeError: string;
  emptyResumes: boolean;
  onResumesChanged: () => void;
  onSubmit: (values: ApplicationValues) => Promise<void>;
  onCancel: (isDirty: boolean) => void;
  newOrEdit: "new" | "edit";
  defaultValues?: Partial<ApplicationFormValues>;
  submitError?: string;
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
  defaultValues,
  submitError
}: ApplicationFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<ApplicationFormValues, unknown, ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues
  });

  const selectedResumeId = useWatch({ control, name: "resumeId" });
  const selectedStatus = useWatch({ control, name: "status" });

  return (
    <>
      <form
        className="flex flex-col gap-4 md:grid md:grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-row gap-2 md:col-span-2">
          <p className="text-label-md ml-auto mr-12">* Required Field</p>
        </div>
        <div className="hidden md:flex md:flex-row md:col-span-2 justify-between md:absolute md:right-8 md:top-4 md:gap-4">
          <ApplicationFormActions
            isSubmitting={isSubmitting}
            newOrEdit={newOrEdit}
            onCancel={() => onCancel(isDirty)}
          />
        </div>
        <Input
          id="company"
          {...register("company")}
          label="* COMPANY NAME"
          placeholder="e.g. Google"
          error={errors.company?.message}
        />
        <Input
          id="title"
          {...register("title")}
          label="* JOB TITLE"
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
          label="* STATUS"
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
          label="* DATE APPLIED"
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
          selectedResumeId={
            typeof selectedResumeId === "number" ? selectedResumeId : undefined
          }
          onSelectResume={(resumeId) =>
            setValue("resumeId", resumeId, {
              shouldDirty: true,
              shouldValidate: true
            })
          }
          onResumesChanged={onResumesChanged}
        />
        <div className="flex flex-col md:col-span-2">
          <ExpandableSection
            title="Additional Information"
            className="flex flex-col md:col-span-2"
          >
            <AdditionalFormOptions
              status={selectedStatus}
              register={register}
              errors={errors}
            />
          </ExpandableSection>
        </div>
        {submitError && (
          <p className="text-label-md text-error md:col-span-2">
            {submitError}
          </p>
        )}
        <div className="flex flex-col gap-3 justify-between md:hidden">
          <ApplicationFormActions
            isSubmitting={isSubmitting}
            newOrEdit={newOrEdit}
            onCancel={() => onCancel(isDirty)}
          />
        </div>
      </form>
    </>
  );
};

export default ApplicationForm;
