import Card from "../../../components/ui/Card";
import ResumeIcon from "../../../assets/images/resume.svg?react";
import type { Resume } from "../../../types/types";
import SingleResume from "./SingleResume";
import Add from "../../../assets/images/add.svg?react";
import { useRef } from "react";
import { uploadResume } from "../resumeApi";
import { toast } from "sonner";
import EmptyState from "../../../components/shared/EmptyState";
import Button from "../../../components/ui/Button";
import LoadingState from "../../../components/shared/LoadingState";
import ErrorState from "../../../components/shared/ErrorState";

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
    try {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      const formData = new FormData();
      formData.append("resume", file);
      await uploadResume(formData);
      toast.success("Resume uploaded!");
      await onResumesChanged();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload resume"
      );
    }
  };

  const uploadButton = (
    <>
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center justify-center gap-3 rounded-card border border-dashed border-outline-variant px-4 py-5 text-body-md text-on-surface-secondary transition hover:bg-surface-container-high"
      >
        <Add />
        <span className="max-w-36 text-center text-white">
          Upload New Asset Version
        </span>
      </Button>
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
          <ResumeIcon fill="#66757d" />
          <h2 className="text-card-title text-on-surface-variant">
            Resume Library
          </h2>
        </span>
        {isLoading ? (
          <LoadingState message="Loading resumes..." compact />
        ) : error ? (
          <ErrorState message={error} compact />
        ) : empty ? (
          <EmptyState
            title="No resumes uploaded"
            description="Upload your first resume to begin tracking your applications."
            action={uploadButton}
            compact={true}
          />
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
