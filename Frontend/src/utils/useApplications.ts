import { useCallback, useEffect, useState } from "react";
import type { JobApplication, JobStatus } from "../types/types";
import {
  getAllApplications,
  updateApplicationStatus
} from "../features/applications/applicationApi";

type useApplicationsProps = {
  applications: JobApplication[];
  isLoading: boolean;
  errorMessage: string | null;
  refetchApplications: () => Promise<void>;
  moveApplication: (
    applicationId: number,
    newStatus: JobApplication["status"]
  ) => Promise<void>;
};

export const useApplications = (): useApplicationsProps => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getAllApplications();
      setApplications(response);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setErrorMessage("Failed to fetch applications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const moveApplication = async (
    applicationId: number,
    newStatus: JobStatus
  ): Promise<void> => {
    const previousApplication = applications.find(
      (application) => application.id === applicationId
    );

    if (!previousApplication || previousApplication.status === newStatus)
      return;

    setApplications((prevApplications) =>
      prevApplications.map((application) =>
        application.id === applicationId
          ? { ...application, status: newStatus }
          : application
      )
    );

    try {
      const updatedApplication = await updateApplicationStatus(
        applicationId,
        newStatus
      );
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.id === applicationId ? updatedApplication : application
        )
      );
    } catch (error) {
      console.error(" Failed to update application status", error);
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.id === applicationId ? previousApplication : application
        )
      );
      setErrorMessage("Failed to update application status");
      throw error;
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    isLoading,
    errorMessage,
    refetchApplications: fetchApplications,
    moveApplication
  };
};
