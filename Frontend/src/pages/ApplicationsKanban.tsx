import { useState, useMemo } from "react";
import Header from "../components/layout/Header";
import { useBreakpoint } from "../utils/useBreakpoint";
import { useSearch } from "../utils/useSearch";
import Button from "../components/ui/Button";

import Add from "../assets/images/add.svg?react";
import type { JobApplication } from "../types/types";
import { useNavigate } from "react-router";
import {
  interviewRate,
  offerRate,
  activePipelineRate
} from "../utils/getStats";
import StatCard from "../components/shared/StatCard";
import { useApplications } from "../utils/useApplications";
import PipelineDistribution from "../features/analytics/components/PipelineDistribution";
import { getAnalyticsData } from "../utils/getAnalyticsData";
import ApplicationsToolbar from "../features/applications/components/ApplicationsToolbar";
import KanbanBoard from "../components/kanban/KanbanBoard";

// eslint-disable-next-line react-refresh/only-export-components
export const SORT_METHODS = ["Newest", "Oldest", "Title", "Company"] as const;
type SortMethod = (typeof SORT_METHODS)[number];

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
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortBy, setSortBy] = useState<SortMethod>("Newest");
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;
  const navigate = useNavigate();

 

  // Fetch applications when the component mounts
  const { applications, isLoading, errorMessage, moveApplication } = useApplications(); // Pre-filter applications by status before passing to search

  const filteredByStatus = applications.filter((app: JobApplication) => {
    if (selectedFilter === "All") return true;

    // Map the friendly dropdown text to the actual database enum values for filtering
    const statusMap: Record<string, string> = {
      Applied: "APPLIED",
      Interviewing: "INTERVIEW",
      Offer: "OFFER",
      Rejected: "REJECTED"
    };

    return app.status === statusMap[selectedFilter];
  });

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
      if (sortBy === "Title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "Company") {
        return a.company.localeCompare(b.company);
      }
      return 0;
    });
  }, [filteredItems, sortBy]);



  if (isLoading) return <p>Loading...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface md:px-6 py-4 relative">
      {isMobile && <Header />}
      <main className="flex flex-col pb-10 gap-6">
        <div>
          {/* <div className="flex justify-between relative"> */}
          <h2 className="mt-6 text-page-title text-on-surface">
            Active Pursuits
          </h2>
          {/* </div> */}
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
          includeStatusFilter={false}
        />
        <div className="mt-8 w-full min-w-0">
          {isLoading ? (
            <p className="text-body-md text-on-surface-variant">
              Loading Applications...
            </p>
          ) : errorMessage ? (
            <p className="text-body-md text-error">{errorMessage}</p>
          ) : sortedApplications.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">
              No applications found.
            </p>
          ) : (
            <KanbanBoard
              applications={sortedApplications}
              moveApplication={moveApplication}
            />

  
          )}
        </div>
        <Button
          onClick={() => navigate("/applications/add")}
          className="fixed z-10 bottom-24 right-8 px-4 py-4 h-12 md:absolute md:top-10 "
          size="md"
          variant="primary"
        >
          <Add fill="#fff" />
          {isTabletUp ? "New Entry" : ""}
        </Button>
       
        <div className="hidden xl:flex xl:gap-4 ">
          {stats.map((stat, index) => {
            return (
              <StatCard
                key={index}
                applications={applications}
                statFunction={stat.statFunction}
                statName={stat.statName}
                primaryCard={stat.primary}
                index={index}
                suffix={stat.suffix}
              />
            );
          })}
        </div>
        <PipelineDistribution
          data={getAnalyticsData(applications).pipelineDistribution}
        />
      </main>
    </div>
  );
};

export default Applications;
