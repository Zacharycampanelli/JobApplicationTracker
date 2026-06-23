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
import SuccessModal from "../components/shared/SuccessModal";

const AddApplication = () => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState(true);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
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
    await createApplication(values);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4 md:relative">
      {isMobile && <Header />}
      <h2 className="mt-6 mb-6 text-page-title text-on-surface">
        Application Entry
      </h2>
      <p className="text-body-lg text-on-surface mb-8">
        Log your professional journey. Maintain the ledger with precision to
        track every opportunity in your career pipeline.
      </p>
      <ApplicationForm
        resumes={resumes}
        isLoadingResumes={isLoading}
        resumeError={error}
        emptyResumes={empty}
        onResumesChanged={loadResumes}
        onSubmit={onSubmit}
        onCancel={() => setIsCancelModalOpen(true)}
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
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        newLocation={"/applications"}
      />
      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        newLocation="/applications"
        />
    </div>
  );
};

export default AddApplication;
