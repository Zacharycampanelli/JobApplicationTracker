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
import Button from "../components/ui/Button";
import { useNavigate } from "react-router";

const AddApplication = () => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;
  const navigate = useNavigate();

  // Resume state
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
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4">
      {isMobile && <Header />}
      <h2 className="mt-6 mb-6 text-page-title text-on-surface">
        Add Application
      </h2>
      <ApplicationForm
        resumes={resumes}
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
      <ResumeManager
        isLoading={isLoading}
        error={error}
        empty={empty}
        resumes={resumes}
        onResumesChanged={loadResumes}
      />
      <Modal
        title="Success!"
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        closeAction={"/applications"}
        closeText="Okay!"
      >
        <p className="text-body-md text-on-surface">
          Application added successfully
        </p>
      </Modal>
      <Modal
        title="Discard changes?"
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        titleClassName="text-error"
        footer={
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => setIsCancelModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsCancelModalOpen(false);
                navigate("/applications");
              }}
            >
              Yes
            </Button>
          </div>
        }
      >
        <p className="text-body-md text-on-surface">
          Are you sure you want to discard your changes?
        </p>
      </Modal>
    </div>
  );
};

export default AddApplication;
