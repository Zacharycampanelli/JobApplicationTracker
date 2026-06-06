import Header from "../components/layout/Header";
import Button from "../components/ui/Button";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { useBreakpoint } from "../utils/useBreakpoint";
import StatCard from "../components/shared/StatCard";
import {
  applicationCount,
  interviewRate,
  successRate,
  totalLeadsRate
} from "../utils/getStats";
import { useApplications } from "../utils/useApplications";

const Dashboard = () => {
  const { user } = useAuthContext();
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;
  const navigate = useNavigate();
  const { applications, isLoading, errorMessage } = useApplications(); // Pre-filter applications by status before passing to search

  if (isLoading) return <p>Loading...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4 relative">
      {isMobile && <Header />}

      <main className="flex flex-col pb-10 gap-9">
        <div className="flex justify-between">
          <div>
            <h2 className="mt-6 text-page-title text-on-surface">
              Hello, <br /> {user?.name}
            </h2>
            <p className="mt-4 text-body-lg text-on-surface-secondary">
              Manage your ongoing career opportunities and architectural
              transitions.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <StatCard
            applications={applications}
            statFunction={applicationCount}
            statName="Total Applications"
            primaryCard
            className=""
          />
          <StatCard
            applications={applications}
            statFunction={interviewRate}
            statName="Interviews"
            className=""
          />
          <StatCard
            applications={applications}
            statFunction={successRate}
            statName="Offers"
            className=""
          />
        </div>
        <div className="hidden md:block">
          <Button
            variant="primary"
            onClick={() => {
              navigate("/applications");
            }}
          >
            Add Application
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
