import AddApplicationForm from "../components/ui/AddApplicatiolnForm";
import Header from "../components/layout/Header";
import ResumeManager from "../components/ui/ResumeManager";
import { useBreakpoint } from "../utils/useBreakpoint";
import { getAllResumes } from "../features/resumeApi";
import { useEffect, useState } from "react";
import type { Resume } from "../types/types";
import Modal from "../components/ui/Modal";

const AddApplication = () => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;

  // Resume state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState(true);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getAllResumes()
      .then((data) => {
        setResumes(data);
        setEmpty(data.length === 0);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load resumes");
        setIsLoading(false);
        setEmpty(true);
      });
  }, []);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4">
      {isMobile && <Header />}
      <h2 className="mt-6 mb-6 text-page-title text-on-surface">
        Add Application
      </h2>
      <AddApplicationForm
        resumes={resumes}
        onSuccess={() => setIsModalOpen(true)}
      />
      <ResumeManager
        isLoading={isLoading}
        error={error}
        empty={empty}
        resumes={resumes}
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
