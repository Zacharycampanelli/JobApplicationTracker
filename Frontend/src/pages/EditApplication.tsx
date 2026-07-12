import { useEffect, useState } from "react";
import { useBreakpoint } from "../utils/useBreakpoint";
import type { ApplicationValues } from "../features/applications/components/ApplicationForm";
import type { Resume } from "../types/types";
import {
  deleteApplication,
  getSingleApplication,
  updateApplication
} from "../features/applications/applicationApi";
import { useParams, useNavigate } from "react-router";
import { getAllResumes } from "../features/resumes/resumeApi";
import Header from "../components/layout/Header";
import ApplicationForm from "../features/applications/components/ApplicationForm";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import CancelModal from "../components/shared/CancelModal";
import { toast } from "sonner";
import LoadingState from "../components/shared/LoadingState";
import ErrorState from "../components/shared/ErrorState";

const EditApplication = () => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;
  const isDesktop = useBreakpoint("xl");
  const { id } = useParams();
  const navigate = useNavigate();

  // Resume state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState(true);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [defaultValues, setDefaultValues] = useState<ApplicationValues>();
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!id) return;
    const getApplication = async () => {
      const application = await getSingleApplication(Number(id));
      setDefaultValues({
        ...application,
        appliedAt: application.appliedAt?.slice(0, 10),
        firstResponseAt: application.firstResponseAt?.slice(0, 10) ?? null,
        interviewAt: application.interviewAt?.slice(0, 10) ?? null,
        offerAt: application.offerAt?.slice(0, 10) ?? null,
        rejectedAt: application.rejectedAt?.slice(0, 10) ?? null
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
    try {
      setSubmitError("");
      await updateApplication(Number(id), values);
      toast.success("Application updated!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update application"
      );
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteApplication(Number(id));
      toast.success("Application deleted!");
      navigate("/applications");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete application"
      );
    }
  };

  if (isLoading) return <LoadingState message="Loading application..." />;
  if (error) return <ErrorState message={error} />
  if (!defaultValues) return <ErrorState message="Application not found" />;
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface md:px-6 py-4 md:relative">
      {isMobile && <Header />}
      <div className="flex items-center justify-between">
        <h2 className="mt-6 mb-6 text-page-title text-on-surface flex-1">
          Application {!isDesktop && <br />}Adjustment
        </h2>
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
        onCancel={(isDirty) => {
          if (isDirty) {
            setIsCancelModalOpen(true);
          } else {
            navigate("/applications");
          }
        }}
        newOrEdit="edit"
        defaultValues={defaultValues}
        submitError={submitError}
      />
      <div className="flex md:w-full md:justify-end">
        <Button
          type="button"
          variant="danger"
          onClick={() => setIsDeleteModalOpen(true)}
          className="w-full md:w-fit mt-3"
        >
          Delete Application
        </Button>
      </div>

      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        newLocation="/applications"
      />

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
