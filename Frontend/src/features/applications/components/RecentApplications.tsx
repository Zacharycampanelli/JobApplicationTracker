import { useEffect, useState } from "react";
import { getRecentApplications } from "../applicationApi";
import type { JobApplication } from "../../../types/types";
import ApplicationCard from "./ApplicationCard";

const RecentApplications = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const loadApplications = async () => {
    setIsLoading(true);

    try {
      const data = await getRecentApplications();
      setApplications(data);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load applications"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="w-[70%]">
          <h4 className="text-card-title mb-4">Recent Applications</h4>
          <div className="flex flex-col gap-4">
          {!isLoading &&
            !error &&
            applications.map((app) => (
              <ApplicationCard key={app.id} app={app} variant="compact" />
            ))}
            </div>
        </div>
        <div className="w-[30%]"></div>
      </div>
    </div>
  );
};

export default RecentApplications;
