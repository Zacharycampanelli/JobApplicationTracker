import { useEffect, useState } from "react";
import { getRecentApplications } from "../applicationApi";
import type { JobApplication } from "../../../types/types";
import ApplicationCard from "./ApplicationCard";
import AddApplication from "../../../assets/images/addApplication.svg?react";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router";

const RecentApplications = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const navigate = useNavigate();

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
        <div>
          <h4 className="text-card-title mb-4">Recent Applications</h4>
          <div className="flex flex-col gap-4">
            {!isLoading &&
              !error &&
              applications.map((app) => (
                <ApplicationCard key={app.publicId} app={app} />
              ))}

            {applications.length < 3 && (
              <div className="">
                <div className="flex flex-col items-center justify-center relative py-8">
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/applications/add")}
                    className="bg-surface-container h-12 w-12 rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center hover:cursor-pointer"
                  >
                    <AddApplication />
                  </Button>
                </div>
                <p className="text-body-lg text-on-surface-variant mt-2 text-center">
                  Expand your ledger
                </p>
                <p className="text-body-md text-on-surface-variant mt-1 text-center">
                  Track your most recent opportunities here.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="w-[30%]"></div>
      </div>
    </div>
  );
};

export default RecentApplications;
