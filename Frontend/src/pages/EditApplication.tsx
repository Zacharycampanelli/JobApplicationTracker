import { useEffect, useState } from "react";
import { useBreakpoint } from "../utils/useBreakpoint";
import type { ApplicationValues } from "../components/ui/ApplicationForm";
import type { Resume } from "../types/types";
import {
  getSingleApplication,
  updateApplication
} from "../features/applicationApi";
import { useParams, useNavigate } from "react-router";
import { getAllResumes } from "../features/resumeApi";
import Header from "../components/layout/Header";
import ApplicationForm from "../components/ui/ApplicationForm";
import ResumeManager from "../components/ui/ResumeManager";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import { twMerge } from "tailwind-merge";

const EditApplication = () => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;
  const { id } = useParams();
  const navigate = useNavigate();

  // Resume state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState(true);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [defaultValues, setDefaultValues] = useState<ApplicationValues>();

  useEffect(() => {
    if (!id) return;
    const getApplication = async () => {
      const application = await getSingleApplication(Number(id));
      setDefaultValues({
        ...application,
        appliedAt: application.appliedAt?.slice(0, 10)
      });
    };
    getApplication();
  }, [id]);

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
    await updateApplication(Number(id), values);
    setIsSuccessModalOpen(true);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!defaultValues) return <p>Application not found</p>;
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4">
      {isMobile && <Header />}
      <h2 className="mt-6 mb-6 text-page-title text-on-surface">
        Edit Application
      </h2>
      <ApplicationForm
        resumes={resumes}
        onSubmit={onSubmit}
        onCancel={() => setIsCancelModalOpen(true)}
        newOrEdit="edit"
        defaultValues={defaultValues}
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
          Application updated successfully
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

export default EditApplication;
