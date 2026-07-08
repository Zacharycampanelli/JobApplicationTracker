import Input from '../../../components/ui/Input';
import SearchIcon from "../../../assets/images/search.svg?react";
import StatusFilter from "../../../assets/images/statusFilter.svg?react";
import Calendar from "../../../assets/images/calendar.svg?react";
import Button from "../../../components/ui/Button";
import { SORT_METHODS } from "../../../pages/ApplicationsKanban";
import { useState } from 'react';

type ApplicationsToolbarProps = {
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  sortBy: typeof SORT_METHODS[number];
  setSortBy: (sort: typeof SORT_METHODS[number]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  includeStatusFilter?: boolean;
}

const dropdownClassName =
  "absolute left-0 top-14 z-20 w-44 rounded-control bg-surface-container-lowest shadow-menu";

const ApplicationsToolbar = ({ selectedFilter, setSelectedFilter, sortBy, setSortBy, searchQuery, setSearchQuery, includeStatusFilter = true }: ApplicationsToolbarProps) => {
      const [isFilterOpen, setIsFilterOpen] = useState(false);
      const [isSortOpen, setIsSortOpen] = useState(false);
    
  return (
     <div className="flex flex-col gap-3 xl:flex-row md:items-center md:justify-between">
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
             {includeStatusFilter && <div className="relative w-full mx-2">
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
              </div>}
              <div className="relative w-full mx-2">
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
  )
}

export default ApplicationsToolbar