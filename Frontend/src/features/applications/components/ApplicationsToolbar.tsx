import { useState } from "react";

import Calendar from "../../../assets/images/calendar.svg?react";
import SearchIcon from "../../../assets/images/search.svg?react";
import StatusFilter from "../../../assets/images/statusFilter.svg?react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Toggle from "../../../components/ui/Toggle";
import {
  SORT_METHODS,
  STATUS_FILTERS,
  type SortMethod,
  type StatusFilter as StatusFilterValue,
  type ViewMode
} from "../applicationViewOptions";

type ApplicationsToolbarProps = {
  selectedFilter: StatusFilterValue;
  setSelectedFilter: (filter: StatusFilterValue) => void;
  sortBy: SortMethod;
  setSortBy: (sort: SortMethod) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  includeStatusFilter?: boolean;
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
};

const dropdownClassName =
  "absolute left-0 top-14 z-20 w-full min-w-44" +
  "overflow-hidden rounded-control border border-outline-variant" +
  "p-1 bg-surface-container-lowest shadow-menu";

const ApplicationsToolbar = ({
  selectedFilter,
  setSelectedFilter,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
  includeStatusFilter = true,
  mode,
  setMode
}: ApplicationsToolbarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleModeChange = (newMode: ViewMode) => {
    setMode(newMode);
    localStorage.setItem("applications-view", newMode);
  };
  return (
    <div
      className="flex flex-col gap-3 md:items-center md:justify-between xl:flex-row"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setIsFilterOpen(false);
          setIsSortOpen(false);
        }
      }}
    >
      <Toggle
        checked={mode === "kanban"}
        onChange={(checked) => handleModeChange(checked ? "kanban" : "list")}
        label="List"
        secondLabel="Kanban"
      />

      <div className="w-full md:min-w-96">
        <Input
          value={searchQuery}
          placeholder="Search by company or role..."
          onChange={(e) => setSearchQuery(e.target.value)}
          startIcon={<SearchIcon />}
        />
      </div>
      <div className="flex items-center md:justify-between gap-3 md:w-full">
        <div className="flex md:justify-center xl:justify-end w-full">
          {includeStatusFilter && (
            <div className="relative w-full mx-2">
              <Button
                type="button"
                variant="secondary"
                aria-expanded={isFilterOpen}
                aria-controls="status-filter-options"
                onClick={() => {
                  setIsFilterOpen((prev) => !prev);
                  setIsSortOpen(false);
                }}
                className={
                  isFilterOpen
                    ? "w-full bg-primary-container text-primary"
                    : "w-full"
                }
              >
                <span>
                  <StatusFilter aria-hidden="true" />
                </span>
                <span>{selectedFilter}</span>
              </Button>

              {isFilterOpen && (
                <div id="status-filter-options" className={dropdownClassName}>
                  {STATUS_FILTERS.map((filter) => (
                    <Button
                      variant="ghost"
                      key={filter}
                      type="button"
                      aria-pressed={selectedFilter === filter}
                      onClick={() => {
                        setSelectedFilter(filter);
                        setIsFilterOpen(false);
                      }}
                      className={
                        selectedFilter === filter
                          ? "w-full justify-start bg-primary-container text-primary"
                          : "w-full justify-start text-on-surface"
                      }
                    >
                      <span>{filter}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="relative w-full mx-2">
            <Button
              type="button"
              variant="secondary"
              aria-expanded={isSortOpen}
              aria-controls="sort-options"
              onClick={() => {
                setIsSortOpen((prev) => !prev);
                setIsFilterOpen(false);
              }}
              className={
                isSortOpen
                  ? "w-full bg-primary-container text-primary"
                  : "w-full"
              }
            >
              <Calendar aria-hidden="true" />
              <span>{sortBy}</span>
            </Button>

            {isSortOpen && (
              <div id="sort-options" className={dropdownClassName}>
                {SORT_METHODS.map((method) => (
                  <Button
                    variant="ghost"
                    key={method}
                    type="button"
                    aria-pressed={sortBy === method}
                    onClick={() => {
                      setSortBy(method);
                      setIsSortOpen(false);
                    }}
                    className={
                      sortBy === method
                        ? "w-full justify-start bg-primary-container text-primary"
                        : "w-full justify-start text-on-surface"
                    }
                  >
                    {method}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsToolbar;
