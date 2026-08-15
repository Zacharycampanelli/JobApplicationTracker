import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import Add from "../assets/images/add.svg?react";
import KanbanBoard from "../components/kanban/KanbanBoard";
import Header from "../components/layout/Header";
import EmptyState from "../components/shared/EmptyState";
import ErrorState from "../components/shared/ErrorState";
import LoadingState from "../components/shared/LoadingState";
import StatCard from "../components/shared/StatCard";
import Button from "../components/ui/Button";
import PipelineDistribution from "../features/analytics/components/PipelineDistribution";
import {
  STATUS_BY_FILTER,
  type SortMethod,
  type StatusFilter,
  type ViewMode
} from "../features/applications/applicationViewOptions";
import ApplicationCard from "../features/applications/components/ApplicationCard";
import ApplicationsToolbar from "../features/applications/components/ApplicationsToolbar";
import type { JobApplication } from "../types/types";
import { getAnalyticsData } from "../utils/getAnalyticsData";
import {
  interviewRate,
  offerRate,
  activePipelineRate
} from "../utils/getStats";
import { useApplications } from "../utils/useApplications";
import { useBreakpoint } from "../utils/useBreakpoint";
import { useSearch } from "../utils/useSearch";

const INITIAL_VISIBLE_COUNT = 5;
const LOAD_MORE_COUNT = 5;

const stats = [
  {
    statFunction: offerRate,
    statName: "Success Rate",
    suffix: "%",
    primary: true
  },
  {
    statFunction: activePipelineRate,
    statName: "Active Pipeline",
    suffix: "%"
  },
  {
    statFunction: interviewRate,
    statName: "Interviews",
    suffix: "%"
  }
];

const Applications = () => {
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>("All");
  const [sortBy, setSortBy] = useState<SortMethod>("Newest");
  const [mode, setMode] = useState<ViewMode>(() => {
    const savedMode = localStorage.getItem("applications-view");

    return savedMode === "list" || savedMode === "kanban"
      ? savedMode
      : "kanban";
  });

  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;
  const navigate = useNavigate();

  const { applications, isLoading, errorMessage, moveApplication } =
    useApplications();

  const filteredByStatus = useMemo(() => {
    if (mode === "kanban" || selectedFilter === "All") {
      return applications;
    }

    const status = STATUS_BY_FILTER[selectedFilter];
    return applications.filter((app) => app.status === status);
  }, [applications, mode, selectedFilter]);

  const { searchQuery, setSearchQuery, filteredItems } = useSearch({
    items: filteredByStatus,
    searchKeys: ["company", "title", "location"]
  });

  const sortedApplications = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (sortBy === "Newest") {
        return (
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
        );
      }
      if (sortBy === "Oldest") {
        return (
          new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
        );
      }
      if (sortBy === "Title") return a.title.localeCompare(b.title);
      if (sortBy === "Company") return a.company.localeCompare(b.company);
      return 0;
    });
  }, [filteredItems, sortBy]);

  const visibleApplications = isTabletUp
    ? sortedApplications.slice(0, visibleCount)
    : sortedApplications;
  const hasMore =
    mode === "list" && isTabletUp && visibleCount < sortedApplications.length;

  if (isLoading) return <LoadingState message="Loading applications..." />;
  if (errorMessage) return <ErrorState message={errorMessage} />;

  return (
    <div
      className={`relative mx-auto flex min-h-dvh w-full flex-col bg-surface py-4 md:px-6 ${
        mode === "kanban" ? "max-w-5xl xl:max-w-7xl" : "max-w-5xl"
      }`}
    >
      {isMobile && <Header />}
      <main className="flex flex-col gap-6 pb-10 md:gap-8">
        <header className="mt-6 flex flex-col gap-3">
          <h1 className="text-page-title text-on-surface">Active Pursuits</h1>
          <p className="text-body-lg text-on-surface-secondary">
            Managing {sortedApplications.length} ongoing professional
            trajectories.
          </p>
        </header>

        <ApplicationsToolbar
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          includeStatusFilter={mode === "list"}
          mode={mode}
          setMode={setMode}
        />

        {applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Add your first application to begin tracking your pipeline."
            action={
              <Button onClick={() => navigate("/applications/add")}>
                Add application
              </Button>
            }
          />
        ) : sortedApplications.length === 0 ? (
          <EmptyState
            title="No matching applications"
            description="Try a different search or clear your active filters."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("All");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : mode === "kanban" ? (
          <div className="min-w-0 w-full">
            <KanbanBoard
              applications={sortedApplications}
              moveApplication={moveApplication}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 xl:grid xl:grid-cols-3">
            {visibleApplications.map((app: JobApplication) => (
              <ApplicationCard key={app.publicId} app={app} showStatus />
            ))}
          </div>
        )}

        <Button
          onClick={() => navigate("/applications/add")}
          className="fixed bottom-24 right-8 z-10 h-12 px-4 py-4 md:absolute md:top-10"
          size="md"
          variant="primary"
        >
          <Add fill="#fff" />
          {isTabletUp ? "New Entry" : ""}
        </Button>

        {hasMore && (
          <Button
            type="button"
            onClick={() => setVisibleCount((count) => count + LOAD_MORE_COUNT)}
            variant="secondary"
            className="mx-auto mt-6"
          >
            Load More
          </Button>
        )}

        <div className="hidden xl:flex xl:gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.statName}
              applications={applications}
              statFunction={stat.statFunction}
              statName={stat.statName}
              primaryCard={stat.primary}
              index={index}
              suffix={stat.suffix}
            />
          ))}
        </div>

        <PipelineDistribution
          data={getAnalyticsData(applications).pipelineDistribution}
        />
      </main>
    </div>
  );
};

export default Applications;
