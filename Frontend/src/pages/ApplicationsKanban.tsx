import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Header from "../components/layout/Header";
import Button from "../components/ui/Button";
import Add from "../assets/images/add.svg?react";
import type { JobApplication } from "../types/types";
import {
  interviewRate,
  offerRate,
  activePipelineRate
} from "../utils/getStats";
import { useBreakpoint } from "../utils/useBreakpoint";
import { useSearch } from "../utils/useSearch";
import { useApplications } from "../utils/useApplications";
import { getAnalyticsData } from "../utils/getAnalyticsData";
import StatCard from "../components/shared/StatCard";
import PipelineDistribution from "../features/analytics/components/PipelineDistribution";
import ApplicationsToolbar from "../features/applications/components/ApplicationsToolbar";
import ApplicationCard from "../features/applications/components/ApplicationCard";
import {
  STATUS_BY_FILTER,
  type SortMethod,
  type StatusFilter
} from "../features/applications/applicationViewOptions";
import KanbanBoard from "../components/kanban/KanbanBoard";

export type ViewMode = "kanban" | "list";

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
  // Add setMode here when the view toggle control is implemented.
  const [mode, setMode] = useState<ViewMode>("kanban");
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
    mode === "list" &&
    isTabletUp &&
    visibleCount < sortedApplications.length;

  if (isLoading) return <p>Loading...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;

  return (
    <div
      className={`relative mx-auto flex min-h-dvh w-full flex-col bg-surface py-4 md:px-6 ${
        mode === "kanban" ? "max-w-5xl xl:max-w-7xl" : "max-w-5xl"
      }`}
    >
      {isMobile && <Header />}
      <main className="flex flex-col gap-6 pb-10">
        <div>
          <h2 className="mt-6 text-page-title text-on-surface">
            Active Pursuits
          </h2>
          <p className="mt-4 text-body-lg text-on-surface-secondary">
            Managing {sortedApplications.length} ongoing professional
            trajectories.
          </p>
        </div>

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

        {sortedApplications.length === 0 ? (
          <p className="mt-8 text-body-md text-on-surface-variant">
            No applications found.
          </p>
        ) : mode === "kanban" ? (
          <div className="mt-8 min-w-0 w-full">
            <KanbanBoard
              applications={sortedApplications}
              moveApplication={moveApplication}
            />
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-4 xl:grid xl:grid-cols-3">
            {visibleApplications.map((app: JobApplication) => (
              <ApplicationCard key={app.id} app={app} showStatus />
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
