import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Input from "../components/ui/Input";
import { useBreakpoint } from "../utils/useBreakpoint";
import SearchIcon from "../assets/images/search.svg?react";
import { useSearch } from "../utils/useSearch";
import { getAllApplications } from "../features/applicationApi";

const Applications = () => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;

  // Store the fetched applications
  const [applications, setApplications] = useState([]);

  // Fetch applications when the component mounts
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getAllApplications();
        setApplications(data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };

    fetchApps();
  }, []);

  const { searchQuery, setSearchQuery, filteredItems } = useSearch({
    items: applications,
    searchKeys: ["company", "title"]
  });

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4">
      {isMobile && <Header />}
      <main className="flex flex-col">
        <h2 className="mt-6 text-auth-title text-on-surface">Active Pursuits</h2>
        <p className="mt-4 text-body-lg text-on-surface-secondary">Managing {filteredItems.length} ongoing professional trajectories.</p>

        <div className="mt-6">
          <Input
            value={searchQuery}
            placeholder="Search by company or role..."
            onChange={(e) => setSearchQuery(e.target.value)}
            startIcon={<SearchIcon />}
          />
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {filteredItems.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">No applications found.</p>
          ) : (
            filteredItems.map((app: any) => (
              <div 
                key={app.id} 
                className="flex flex-col gap-2 rounded-2xl bg-surface-container-low p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-card-title text-on-surface">{app.title}</h3>
                    <p className="text-body-md text-on-surface-secondary">{app.company}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-status text-primary">
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
