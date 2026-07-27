import { useState, useEffect } from "react";
import type { ApplicationActivity } from "../../../types/types";
import { getUserRecentActivities } from "../activityApi";
import ActivityItem from "./ActivityItem";
import LoadingState from "../../../components/shared/LoadingState";
import ErrorState from "../../../components/shared/ErrorState";

const RecentActivity = () => {
  const [activities, setActivities] = useState<ApplicationActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await getUserRecentActivities();
        setActivities(data)
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load activities"
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadActivities();
  }, []);

  return (
    <div className="bg-surface-container-low flex flex-col gap-6 p-6 rounded-card shadow-sm min-w-[90%] w-full">
      <header>
        <h3 className="text-card-title">Activity Journal</h3>
      </header>
      {isLoading && <LoadingState />}
      {error && <ErrorState message={error} />}
      <div className="flex flex-col gap-8">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
