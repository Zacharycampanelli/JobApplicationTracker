import ApplicationForm, {
  type ApplicationValues
} from "../components/ui/ApplicationForm";
import Header from "../components/layout/Header";
import ResumeManager from "../components/ui/ResumeManager";
import { useBreakpoint } from "../utils/useBreakpoint";
import { getAllResumes } from "../features/resumeApi";
import { useEffect, useState } from "react";
import type { Resume } from "../types/types";
import Modal from "../components/ui/Modal";
import { createApplication } from "../features/applicationApi";

const AddApplication = () => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;

  // Resume state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState(true);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4">
      {isMobile && <Header />}
      <h2 className="mt-6 mb-6 text-page-title text-on-surface">
        Add Application
      </h2>
      <ApplicationForm
        resumes={resumes}
        onSubmit={onSubmit}
        newOrEdit="new"
        defaultValues={{
          title: "",
          company: "",
          status: "APPLIED",
          appliedAt: new Date().toISOString().slice(0, 10),
          notes: "",
          link: ""
        }}
      />
      <ResumeManager
        isLoading={isLoading}
        error={error}
        empty={empty}
        resumes={resumes}
        onResumesChanged={loadResumes}
      />
      <Modal
        title="Success!"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeAction={"/applications"}
        closeText="Okay!"
      >
        <p className="text-body-md text-on-surface">
          Application added successfully
        </p>
      </Modal>
    </div>
  );
};

export default AddApplication;
