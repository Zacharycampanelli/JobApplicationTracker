import { useCallback, useEffect, useState } from "react";
import type { JobApplication } from "../types/types";
import { getAllApplications } from "../features/applications/applicationApi";

type useApplicationsProps = {
  applications: JobApplication[];
  isLoading: boolean;
  errorMessage: string | null;
  refetchApplications: () => Promise<void>;
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

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return { applications, isLoading, errorMessage, refetchApplications: fetchApplications };
};