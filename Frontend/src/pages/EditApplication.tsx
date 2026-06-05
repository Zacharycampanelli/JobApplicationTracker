import { useEffect, useState } from "react";
import { useBreakpoint } from "../utils/useBreakpoint";
import type { ApplicationValues } from "../components/ui/ApplicationForm";
import type { Resume } from "../types/types";
import {
  deleteApplication,
  getSingleApplication,
  updateApplication
} from "../features/applicationApi";
import { useParams, useNavigate } from "react-router";
import { getAllResumes } from "../features/resumeApi";
import Header from "../components/layout/Header";
import ApplicationForm from "../components/ui/ApplicationForm";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

  const handleDelete = async () => {
    if (!id) return;
    await deleteApplication(Number(id));
    navigate("/applications");
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!defaultValues) return <p>Application not found</p>;
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4 md:relative">
      {isMobile && <Header />}
      <div className="flex items-center justify-between">
        <h2 className="mt-6 mb-6 text-page-title text-on-surface flex-1">
          Application Adjustment
        </h2>
        <Button
          type="button"
          variant="danger"
          onClick={() => setIsDeleteModalOpen(true)}
          className="w-1/3 flex-0 md:hidden"
        >
          Delete
        </Button>
      </div>
      <p className="text-body-lg text-on-surface mb-8">
        Refine the spatial parameters of your career progression.
      </p>
      <ApplicationForm
        resumes={resumes}
        isLoadingResumes={isLoading}
        resumeError={error}
        emptyResumes={empty}
        onResumesChanged={loadResumes}
        onSubmit={onSubmit}
        onCancel={() => setIsCancelModalOpen(true)}
        onDelete={() => setIsDeleteModalOpen(true)}
        newOrEdit="edit"
        defaultValues={defaultValues}
      />
      <div className="hidden md:flex md:w-full md:justify-end">
        <Button
          type="button"
          variant="danger"
          onClick={() => setIsDeleteModalOpen(true)}
          className="w-fit mt-8"
        >
          Delete Application
        </Button>
      </div>
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
      <Modal
        title="Delete application?"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        titleClassName="text-error"
        footer={
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Yes, delete
            </Button>
          </div>
        }
      >
        <p className="text-body-md text-on-surface">
          Are you sure you want to delete this application?
        </p>
      </Modal>
    </div>
  );
};

export default EditApplication;
