import { useState, useEffect, useMemo } from "react";
import Header from "../components/layout/Header";
import Input from "../components/ui/Input";
import { useBreakpoint } from "../utils/useBreakpoint";
import { useSearch } from "../utils/useSearch";
import { getAllApplications } from "../features/applicationApi";
import Button from "../components/ui/Button";
import SearchIcon from "../assets/images/search.svg?react";
import StatusFilter from "../assets/images/statusFilter.svg?react";
import Calendar from "../assets/images/calendar.svg?react";
import Add from "../assets/images/add.svg?react";
import RightArrow from "../assets/images/rightArrow.svg?react";
import type { JobApplication } from "../types/types";
import { useNavigate } from "react-router";
import CompanyLogo from "../components/ui/CompanyLogo";
import StatusClassBadge from "../components/ui/StatusClassBadge";

const SORT_METHODS = ["Newest", "Oldest", "Title", "Company"] as const;
type SortMethod = (typeof SORT_METHODS)[number];

const dropdownClassName =
  "absolute left-0 top-14 z-20 w-44 rounded-control bg-surface-container-lowest shadow-menu";

const Applications = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortMethod>("Newest");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;
  const isDesktopUp = useBreakpoint("xl");
  const navigate = useNavigate();

  // For tablet and up
  const INITIAL_VISIBLE_COUNT = 5;
  const LOAD_MORE_COUNT = 5;
  // On mobile, always show all, otherwise show initial count
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  // Store the fetched applications
  const [applications, setApplications] = useState<JobApplication[]>([]);

  // Fetch applications when the component mounts
  useEffect(() => {
    const fetchApps = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getAllApplications();
        setApplications(data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load applications."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchApps();
  }, []);
  // Pre-filter applications by status before passing to search
  const filteredByStatus = applications.filter((app: any) => {
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

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4 relative">
      {isMobile && <Header />}
      <main className="flex flex-col pb-10">
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
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="md:w-96">
            <Input
              value={searchQuery}
              placeholder="Search by company or role..."
              onChange={(e) => setSearchQuery(e.target.value)}
              startIcon={<SearchIcon />}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsFilterOpen((prev) => !prev);
                  setIsSortOpen(false);
                }}
              >
                <span>
                  <StatusFilter />
                </span>
                <span className="text-action">{selectedFilter}</span>
              </Button>

              {isFilterOpen && (
                <div className={dropdownClassName}>
                  {["All", "Applied", "Interviewing", "Offer", "Rejected"].map(
                    (filter) => (
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
                    )
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsSortOpen((prev) => !prev);
                  setIsFilterOpen(false);
                }}
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
              <div
                key={app.id}
                className="flex flex-col group gap-2 rounded-2xl bg-surface-container-low p-4 shadow-sm relative"
              >
                <div className="flex items-start justify-between gap-4 md:items-center xl:flex-col xl:items-stretch">
                  <div className="flex min-w-0 flex-1 items-start gap-4 xl:flex-col">
                    {/* Tablet layout logo */}
                    <div className="hidden md:block xl:hidden">
                      <CompanyLogo
                        url={app?.link || undefined}
                        company={app.company}
                      />
                    </div>

                    {/* Desktop layout logo + status */}
                    <div className="hidden xl:flex xl:items-start xl:justify-between xl:w-full">
                      <CompanyLogo
                        url={app?.link || undefined}
                        company={app.company}
                      />
                      <StatusClassBadge status={app.status} />
                    </div>
                    <div className="min-w-0 flex-1 xl:min-h-[76px]">
                      <h3 className="text-card-title text-on-surface">
                        {app.title}
                      </h3>
                      <p className="mt-1 text-card-meta text-on-surface-secondary">
                        {app.company}
                        {app.location ? ` • ${app.location}` : ""}
                      </p>
                      {app.appliedAt && (
                        <p className="mt-2 text-label-md text-on-surface-variant md:hidden">
                          Applied:{" "}
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  {app.appliedAt && (
                    <div className="hidden shrink-0 text-left md:block md:min-w-28 xl:hidden">
                      <p className="text-label-md text-on-surface-secondary uppercase">
                        Applied
                      </p>
                      <p className="text-label-md text-on-surface-variant">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <StatusClassBadge status={app.status} className="xl:hidden" />
                  {app.appliedAt && (
                    <div className="hidden border-t border-outline-variant pt-3 xl:flex xl:items-center xl:justify-between">
                      <p className="text-label-md uppercase text-on-surface-variant">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate(`/applications/edit/${app.id}`)}
                        className="group-hover:flex md:static absolute bottom-8 right-6"
                      >
                        <RightArrow
                          width={18}
                          height={18}
                          color="text-on-surface-secondary"
                        />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>{" "}
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
      </main>
    </div>
  );
};

export default Applications;
