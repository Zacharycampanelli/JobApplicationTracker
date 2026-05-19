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
import type { JobApplication } from "../types/types";

const statusClassMap: Record<string, string> = {
  APPLIED: "status-applied",
  INTERVIEW: "status-interview",
  OFFER: "status-offer",
  REJECTED: "status-rejected"
};

const SORT_METHODS = ["Newest", "Oldest", "Title", "Company"] as const;
type SortMethod = (typeof SORT_METHODS)[number];

const dropdownClassName = "absolute left-0 top-14 z-20 w-44 rounded-control bg-surface-container-lowest shadow-menu"

const Applications = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortMethod>("Newest");
  const [isLoading, setIsLoading] = useState(true);
const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;

  // Store the fetched applications
  const [applications, setApplications] = useState<JobApplication[]>([]);

  // Fetch applications when the component mounts
  useEffect(() => {
    const fetchApps = async () => {
      try {
        setIsLoading(true)
        setErrorMessage(null)

        const data = await getAllApplications();
        setApplications(data);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to load applications.");
      } finally {
        setIsLoading(false)
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
    searchKeys: ["company", "title"]
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

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4">
      {isMobile && <Header />}
      <main className="flex flex-col">
        <h2 className="mt-6 text-auth-title text-on-surface">
          Active Pursuits
        </h2>
        <p className="mt-4 text-body-lg text-on-surface-secondary">
          Managing {sortedApplications.length} ongoing professional
          trajectories.
        </p>

        <div className="mt-6">
          <Input
            value={searchQuery}
            placeholder="Search by company or role..."
            onChange={(e) => setSearchQuery(e.target.value)}
            startIcon={<SearchIcon />}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
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

        <div className="mt-8 flex flex-col gap-4">
           { isLoading ? (
            <p className="text-body-md text-on-surface-variant">
              Loading Applications...
            </p>
           ) : errorMessage ? (
            <p className="text-body-md text-error">
              {errorMessage}
            </p>
           ) : sortedApplications.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">
              No applications found.
            </p>
          ) : (
            sortedApplications.map((app: JobApplication) => (
              <div
                key={app.id}
                className="flex flex-col gap-2 rounded-2xl bg-surface-container-low p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-card-title text-on-surface">
                      {app.title}
                    </h3>
                    <p className="text-body-md text-on-surface-secondary">
                      {app.company}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-status ${statusClassMap[app.status] ?? "status-applied"}`}
                  >
                    {app.status}
                  </span>
                </div>
                {app.appliedAt && (
                  <p className="text-label-md text-on-surface-variant">
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Applications;
