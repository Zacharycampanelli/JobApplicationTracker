import { useState, useMemo } from "react";
import Header from "../components/layout/Header";
import Input from "../components/ui/Input";
import { useBreakpoint } from "../utils/useBreakpoint";
import { useSearch } from "../utils/useSearch";
import Button from "../components/ui/Button";
import SearchIcon from "../assets/images/search.svg?react";
import StatusFilter from "../assets/images/statusFilter.svg?react";
import Calendar from "../assets/images/calendar.svg?react";
import Add from "../assets/images/add.svg?react";
import type { JobApplication } from "../types/types";
import { useNavigate } from "react-router";
import ApplicationCard from "../features/applications/components/ApplicationCard";
import { interviewRate, successRate, totalLeadsRate } from "../utils/getStats";
import StatCard from "../components/shared/StatCard";
import { useApplications } from "../utils/useApplications";

const SORT_METHODS = ["Newest", "Oldest", "Title", "Company"] as const;
type SortMethod = (typeof SORT_METHODS)[number];

const dropdownClassName =
  "absolute left-0 top-14 z-20 w-44 rounded-control bg-surface-container-lowest shadow-menu";

const Applications = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortMethod>("Newest");
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;
  const navigate = useNavigate();

  // For tablet and up
  const INITIAL_VISIBLE_COUNT = 5;
  const LOAD_MORE_COUNT = 5;
  // On mobile, always show all, otherwise show initial count
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  // Fetch applications when the component mounts
  const { applications, isLoading, errorMessage } = useApplications(); // Pre-filter applications by status before passing to search

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

  const visibleApplications = isTabletUp
    ? sortedApplications.slice(0, visibleCount)
    : sortedApplications;
  const hasMore = isTabletUp && visibleCount < sortedApplications.length;

  if (isLoading) return <p>Loading...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4 relative">
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
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:min-w-96">
            <Input
              value={searchQuery}
              placeholder="Search by company or role..."
              onChange={(e) => setSearchQuery(e.target.value)}
              startIcon={<SearchIcon />}
            />
          </div>
          <div className="flex items-center md:justify-between gap-3">
            <div className="flex justify-end w-full">
              <div className="relative w-full mx-2 md:w-auto md:min-w-28">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsFilterOpen((prev) => !prev);
                    setIsSortOpen(false);
                  }}
                  className="w-full"
                >
                  <span>
                    <StatusFilter />
                  </span>
                  <span className="text-action">{selectedFilter}</span>
                </Button>

                {isFilterOpen && (
                  <div className={dropdownClassName}>
                    {[
                      "All",
                      "Applied",
                      "Interviewing",
                      "Offer",
                      "Rejected"
                    ].map((filter) => (
                      <Button
                        variant="ghost"
                        key={filter}
                        type="button"
                        onClick={() => {
                          setSelectedFilter(filter);
                          setIsFilterOpen(false);
                        }}
                        className="block w-full px-3 py-2 text-left text-body-md text-on-surface hover:bg-surface-container"
                      >
                        <span>{filter}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative w-full mx-2 md:w-auto">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsSortOpen((prev) => !prev);
                    setIsFilterOpen(false);
                  }}
                  className="w-full"
                >
                  <span>
                    <Calendar />
                  </span>
                  <span className="text-action">{sortBy}</span>
                </Button>

                {isSortOpen && (
                  <div className={dropdownClassName}>
                    {SORT_METHODS.map((method) => (
                      <Button
                        variant="ghost"
                        key={method}
                        type="button"
                        onClick={() => {
                          setSortBy(method);
                          setIsSortOpen(false);
                        }}
                        className="block w-full px-3 py-2 text-left text-body-md text-on-surface hover:bg-surface-container"
                      >
                        <span>{method}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 xl:grid xl:grid-cols-3">
          {isLoading ? (
            <p className="text-body-md text-on-surface-variant">
              Loading Applications...
            </p>
          ) : errorMessage ? (
            <p className="text-body-md text-error">{errorMessage}</p>
          ) : visibleApplications.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">
              No applications found.
            </p>
          ) : (
            visibleApplications.map((app: JobApplication) => (
              <ApplicationCard key={app.id} app={app} />
            ))
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
        {hasMore && (
          <Button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
            variant="secondary"
            className="mx-auto mt-6"
          >
            Load More
          </Button>
        )}
        <div className="hidden xl:flex xl:gap-4 ">
          <StatCard
            applications={applications}
            statFunction={successRate}
            statName="Success Rate"
            primaryCard={true}
          />
          <StatCard
            applications={applications}
            statFunction={totalLeadsRate}
            statName="Total Leads"
          />
          <StatCard
            applications={applications}
            statFunction={interviewRate}
            statName="Interviews"
          />
        </div>
      </main>
    </div>
  );
};

export default Applications;
