import ApplicationForm, {
  type ApplicationValues
} from "../features/applications/components/ApplicationForm";
import Header from "../components/layout/Header";
import { useBreakpoint } from "../utils/useBreakpoint";
import { getAllResumes } from "../features/resumes/resumeApi";
import { useEffect, useState } from "react";
import type { Resume } from "../types/types";
import { createApplication } from "../features/applications/applicationApi";
import CancelModal from "../components/shared/CancelModal";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const AddApplication = () => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState(true);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const loadResumes = async () => {
    setIsLoading(true);

    try {
      const data = await getAllResumes();
      setResumes(data);
      setEmpty(data.length === 0);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resumes");
      setEmpty(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const onSubmit = async (values: ApplicationValues) => {
    try {
      await createApplication(values);
      toast.success("Application added");
      navigate("/applications");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add application"
      );
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface md:px-6 py-4 md:relative">
      {isMobile && <Header />}

      <main className="flex flex-col gap-6 pb-10 md:gap-8">
        <header className="mt-6 flex flex-col gap-3">
          <h1 className="text-page-title text-on-surface">Application Entry</h1>

          <p className="text-body-lg text-on-surface-secondary">
            Log your professional journey. Maintain the ledger with precision to
            track every opportunity in your career pipeline.
          </p>
        </header>
        <ApplicationForm
          resumes={resumes}
          isLoadingResumes={isLoading}
          resumeError={error}
          emptyResumes={empty}
          onResumesChanged={loadResumes}
          onSubmit={onSubmit}
          onCancel={(isDirty) => {
            if (isDirty) {
              setIsCancelModalOpen(true);
            } else {
              navigate("/applications");
            }
          }}
          newOrEdit="new"
          defaultValues={{
            title: "",
            company: "",
            location: "",
            status: "APPLIED",
            appliedAt: new Date().toISOString().slice(0, 10),
            notes: "",
            link: ""
          }}
        />
      </main>
      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        newLocation="/applications"
      />
    </div>
  );
};

export default AddApplication;
