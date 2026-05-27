import Add from "../../assets/images/add.svg?react";
import Card from "./Card";
import ResumeIcon from "../../assets/images/resume.svg?react";
import SingleResume from "./SingleResume";
import type { Resume } from "../../types/types";

type ResumeSelectProps = {
  resumes: Resume[];
  selectedResumeId?: number;
  onSelectResume: (resumeId: number) => void;
};

const ResumeSelect = ({
  resumes,
  selectedResumeId,
  onSelectResume,
}: ResumeSelectProps) => {
  return (
    <Card className="bg-surface-container shadow-none">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 text-primary">
          <ResumeIcon />
          <h2 className="text-card-title text-on-surface">Targeted Assets</h2>
        </div>

        <div className="flex flex-col gap-4">
          {resumes.length === 0 ? (
            <p className="text-body-md text-on-surface-secondary">
              No resumes uploaded yet
            </p>
          ) : (
            resumes.map((resume) => (
              <SingleResume
                key={resume.id}
                resume={resume}
                selected={selectedResumeId === resume.id}
                onClick={() => onSelectResume(resume.id)}
              />
            ))
          )}
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-3 rounded-card border border-dashed border-outline-variant px-4 py-5 text-body-md text-on-surface-secondary transition hover:bg-surface-container-high"
        >
          <Add />
          <span className="max-w-36 text-center">Upload New Asset Version</span>
        </button>
      </div>
    </Card>
  );
};

export default ResumeSelect;
