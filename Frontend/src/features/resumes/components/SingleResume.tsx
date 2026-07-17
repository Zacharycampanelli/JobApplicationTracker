import type { Resume } from "../../../types/types";
import SelectInput from "../../../assets/images/selectInput.svg?react";
import SelectedInput from "../../../assets/images/selectedInput.svg?react";
import { deleteResume } from "../resumeApi";
import type React from "react";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

type SingleResumeProps = {
  resume: Resume;
  selected: boolean;
  onClick?: () => void;
  deletable?: boolean;
  onDeleteSuccess?: () => void;
};

const formatResumeDate = (createdAt: string) => {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric"
  }).format(new Date(createdAt));
};

const SingleResume = ({
  resume,
  selected,
  onClick,
  deletable = false,
  onDeleteSuccess
}: SingleResumeProps) => {
  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    try {
      await deleteResume(resume.id);
      toast.success("Resume deleted!");
      await onDeleteSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete resume"
      );
    }
  };

  return (
    <div
      className={twMerge(
        "flex w-full items-center gap-4 rounded-card",
        "bg-surface-container-lowest px-4 py-4 text-left shadow-menu",
        "transition-[background-color,box-shadow] duration-150",
        "hover:bg-surface-container-high hover:shadow-raised",
        "focus-within:ring-2 focus-within:ring-primary",
        "focus-within:ring-offset-2 focus-within:ring-offset-surface-container",
        selected && "ring-2 ring-primary"
      )}
    >
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        aria-label={`Select ${resume.name}`}
        className="
          flex flex-1 items-center gap-4 rounded-control text-left
          transition-colors duration-150
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary
        "
      >
        <span className="shrink-0 text-primary">
          {selected ? <SelectedInput /> : <SelectInput />}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-body-md font-semibold text-on-surface">
            {resume.name}
          </span>
          <span className="text-label-md text-on-surface-secondary">
            Last updated {formatResumeDate(resume.createdAt)}
          </span>
        </span>
      </button>
      {deletable && (
        <button
          onClick={handleDelete}
          type="button"
          aria-label={`Delete ${resume.name}`}
          className="
            flex size-9 shrink-0 items-center justify-center rounded-control
            text-xl text-on-surface-secondary
            transition-colors duration-150
            hover:bg-error-container/30 hover:text-error
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-error
          "
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
};

export default SingleResume;
