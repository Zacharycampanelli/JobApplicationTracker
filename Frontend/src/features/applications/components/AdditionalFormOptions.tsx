import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ApplicationFormValues } from "./ApplicationForm";

type AdditionalFormOptionsProps = {
  status: ApplicationFormValues["status"];
  register: UseFormRegister<ApplicationFormValues>;
  errors: FieldErrors<ApplicationFormValues>;
};

const AdditionalFormOptions = ({
  status,
  register,
  errors
}: AdditionalFormOptionsProps) => {
  const shouldShowFirstResponse =
    status === "INTERVIEW" || status === "OFFER" || status === "REJECTED";
  const shouldShowInterview = status === "INTERVIEW" || status === "OFFER" || status === "REJECTED";
  const shouldShowOffer = status === "OFFER" || status === "REJECTED";
  const shouldShowRejected = status === "REJECTED";

  return (
    <div className="mt-4 flex flex-col gap-6 md:grid md:grid-cols-2 xl:grid-cols-3">
      <Select
        id="source"
        {...register("source")}
        label="SOURCE"
        name="source"
        options={[
          { value: "LINKEDIN", label: "LinkedIn" },
          { value: "INDEED", label: "Indeed" },
          { value: "COMPANY_SITE", label: "Company Site" },
          { value: "REFERRAL", label: "Referral" },
          { value: "RECRUITER", label: "Recruiter" },
          { value: "NETWORKING", label: "Networking" },
          { value: "OTHER", label: "Other" }
        ]}
        error={errors?.source?.message}
      />
      <Select
        id="workMode"
        {...register("workMode")}
        label="WORK MODE"
        name="workMode"
        options={[
          { value: "REMOTE", label: "Remote" },
          { value: "HYBRID", label: "Hybrid" },
          { value: "ONSITE", label: "Onsite" }
        ]}
        error={errors?.workMode?.message}
      />
      <Input
        id="salaryMin"
        {...register("salaryMin")}
        label="MINIMUM SALARY"
        name="salaryMin"
        placeholder="e.g. 60000"
        type="number"
        error={errors?.salaryMin?.message}
      />
      <Input
        id="salaryMax"
        {...register("salaryMax")}
        label="MAXIMUM SALARY"
        name="salaryMax"
        placeholder="e.g. 80000"
        type="number"
        error={errors?.salaryMax?.message}
      />
      {shouldShowFirstResponse && (
        <Input
          id="firstResponseAt"
          {...register("firstResponseAt")}
          label="FIRST RESPONSE"
          name="firstResponseAt"
          placeholder="e.g. 2022-01-01"
          type="date"
          error={errors?.firstResponseAt?.message}
        />
      )}
      {shouldShowInterview && (
        <Input
          id="interviewAt"
          {...register("interviewAt")}
          label="INTERVIEW DATE"
          name="interviewAt"
          placeholder="e.g. 2022-01-01"
          type="date"
          error={errors?.interviewAt?.message}
        />
      )}
      {shouldShowOffer && (
        <Input
          id="offerAt"
          {...register("offerAt")}
          label="OFFER DATE"
          name="offerAt"
          placeholder="e.g. 2022-01-01"
          type="date"
          error={errors?.offerAt?.message}
        />
      )}
      {shouldShowRejected && (
        <Input
          id="rejectedAt"
          {...register("rejectedAt")}
          label="REJECTED DATE"
          name="rejectedAt"
          placeholder="e.g. 2022-01-01"
          type="date"
          error={errors?.rejectedAt?.message}
        />
      )}
    </div>
  );
};

export default AdditionalFormOptions;
