import Card from "./Card";
import ResumeIcon from "../../assets/images/resume.svg?react";
import type { Resume } from "../../types/types";
import SingleResume from "./SingleResume";
import Add from "../../assets/images/add.svg?react";

type ResumeManagerProps = {
  isLoading: boolean;
  error: string;
  empty: boolean;
  resumes: Resume[];
};

const ResumeManager = ({
  isLoading,
  error,
  empty,
  resumes
}: ResumeManagerProps) => {
  return (
    <Card className="mt-8 bg-surface-container">
      <div className="flex flex-col gap-5">
        <span className="flex items-center gap-2 text-primary">
          <ResumeIcon />
          <h2 className="text-card-title text-on-surface">Resume Library</h2>
        </span>
        {isLoading ? (
          <p className="text-body-md text-on-surface-secondary">Loading...</p>
        ) : error ? (
          <p className="text-body-md text-error">Error: {error}</p>
        ) : empty ? (
          <p className="text-body-md text-on-surface-secondary">
            No resumes uploaded
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {resumes &&
              resumes.map((resume) => (
                <SingleResume
                  key={resume.id}
                  resume={resume}
                  selected={false}
                />
              ))}
          </div>
        )}
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

export default ResumeManager;
