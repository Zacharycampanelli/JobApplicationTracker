import type { Resume } from "../../types/types";
import SelectInput from "../../assets/images/selectInput.svg?react";
import SelectedInput from "../../assets/images/selectedInput.svg?react";
import { twMerge } from "tailwind-merge";

type SingleResumeProps = {
  resume: Resume;
  selected: boolean;
  onClick?: () => void;
};

const formatResumeDate = (createdAt: string) => {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric"
  }).format(new Date(createdAt));
};

const SingleResume = ({ resume, selected, onClick }: SingleResumeProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        "flex w-full items-center gap-4 rounded-card bg-surface-container-lowest px-4 py-4 text-left shadow-menu transition",
        selected && "outline-2 outline-primary"
      )}
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
  );
};

export default SingleResume;
