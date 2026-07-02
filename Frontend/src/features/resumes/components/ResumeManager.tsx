import Card from "../../../components/ui/Card";
import ResumeIcon from "../../../assets/images/resume.svg?react";
import type { Resume } from "../../../types/types";
import SingleResume from "./SingleResume";
import Add from "../../../assets/images/add.svg?react";
import { useRef } from "react";
import { uploadResume } from "../resumeApi";

type ResumeManagerProps = {
  isLoading: boolean;
  error: string;
  empty: boolean;
  resumes: Resume[];
  onResumesChanged: () => void;
  selectedResumeId?: number;
  onSelectResume?: (resumeId: number) => void;
};

const ResumeManager = ({
  isLoading,
  error,
  empty,
  resumes,
  onResumesChanged,
  selectedResumeId,
  onSelectResume
}: ResumeManagerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    await uploadResume(formData);
    await onResumesChanged();
  };

  const uploadButton = (
    <>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center justify-center gap-3 rounded-card border border-dashed border-outline-variant px-4 py-5 text-body-md text-on-surface-secondary transition hover:bg-surface-container-high"
      >
        <Add />
        <span className="max-w-36 text-center">Upload New Asset Version</span>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />
    </>
  );

  return (
    <Card className="bg-surface-container md:col-span-2">
      <div className="flex flex-col gap-5">
        <span className="flex items-center gap-2 text-primary">
          <ResumeIcon fill="#66757d"/>
          <h2 className="text-card-title text-on-surface-variant">Resume Library</h2>
        </span>
        {isLoading ? (
          <p className="text-body-md text-on-surface-secondary">Loading...</p>
        ) : error ? (
          <p className="text-body-md text-error">Error: {error}</p>
        ) : empty ? (
          <div className="flex flex-col gap-4">

          <p className="text-body-md text-on-surface-secondary">
            No resumes uploaded
          </p>
          {uploadButton}
          </div>
        ) : (
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
            {resumes &&
              resumes.map((resume) => (
                <SingleResume
                  key={resume.id}
                  resume={resume}
                  selected={selectedResumeId === resume.id}
                  onClick={() => onSelectResume?.(resume.id)}
                  deletable
                  onDeleteSuccess={onResumesChanged}
                />
              ))}
              {uploadButton}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResumeManager;
