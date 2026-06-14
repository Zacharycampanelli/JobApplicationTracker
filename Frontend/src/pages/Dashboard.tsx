import Header from "../components/layout/Header";
import Button from "../components/ui/Button";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { useBreakpoint } from "../utils/useBreakpoint";
import StatCard from "../components/shared/StatCard";
import careerPlanning from "../assets/images/CareerPlanning.png";

import {
  applicationCount,
  interviewRate,
  successRate
} from "../utils/getStats";
import { useApplications } from "../utils/useApplications";
import Resume from "../assets/images/resume.svg?react";
import SuccessApp from "../assets/images/successApp.svg?react";
import Medal from "../assets/images/medal.svg?react";
import Add from "../assets/images/add.svg?react";
import RecentApplications from "../features/applications/components/RecentApplications";

const stats = [
  {
    statFunction: applicationCount,
    statName: "Total Applications",
    icon: Resume,
    className: "bg-primary-container"
  },

  {
    statFunction: interviewRate,
    statName: "Interviews",
    icon: SuccessApp
  },

  {
    statFunction: successRate,
    statName: "Offers",
    icon: Medal
  }
];

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

      <main className="flex flex-col pb-10 gap-9 items-start">
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
        <div>
          <div className="flex flex-col gap-6 items-center md:flex-row-reverse">
            {/* <div className="md:flex"> */}
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                applications={applications}
                statFunction={stat.statFunction}
                statName={stat.statName}
                icon={stat.icon}
                index={index}
                className={stat.className}
              />
            ))}
          </div>
          <div
            className="flex flex-col justify-center items-center aspect-square w-95 relative rounded-full overflow-hidden bg-cover bg-center shrink-0 mt-6 gap-8 md:hidden"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, rgba(0, 0, 0, 0.5) 95%), url(${careerPlanning})`
            }}
          >
            <div className="absolute inset-0 bg-blue-500 opacity-50 mix-blend-multiply"></div>
            <h5 className="text-card-title text-white text-center z-10">
              Architect your future.
            </h5>
            <p className="text-white text-body-lg z-10 text-justify px-10 mt-4">
              Every entry in your ledger is a step closer to the next milestone
              in your professional journey.
            </p>
            <Button
              variant="ghost"
              className="bg-white z-10 mt-4 text-primary"
              onClick={() => navigate("/applications/add")}
            >
              <Add />
              Quick Add
            </Button>
          </div>
          {isMobile && (
            <p className="mt-4 text-body-lg text-on-surface-secondary">
              Recent activity - coming soon daily insights - coming soon
            </p>
          )}
        </div>
        <div className="hidden md:flex">
          <RecentApplications />
          <div className="w-1/2 flex flex-col gap-4">
            <p>market outlook</p>
            <p>quick resources</p>
          </div>
        </div>
      </main>
      <div className="hidden md:block">
        {isMobile && (
          <Button
            variant="primary"
            onClick={() => {
              navigate("/applications");
            }}
          >
            Add Application
          </Button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
