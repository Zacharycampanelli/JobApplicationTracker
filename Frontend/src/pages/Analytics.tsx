import Header from "../components/layout/Header";
import { useBreakpoint } from "../utils/useBreakpoint";
import Resume from "../assets/images/resume.svg?react";
import SuccessApp from "../assets/images/successApp.svg?react";
import Medal from "../assets/images/medal.svg?react";
import Calendar from "../assets/images/calendar.svg?react";
import {
  applicationCount,
  interviewRate,
  responseRate,
  offerRate,
  activePipelineRate,
  averageResponseDays
} from "../utils/getStats";
import StatCard from "../components/shared/StatCard";
import { useApplications } from "../utils/useApplications";

const stats = [
  {
    statFunction: applicationCount,
    statName: "Total Applications",
    icon: Resume,
    primaryCard: true,
  },

  {
    statFunction: interviewRate,
    statName: "Interviews",
    icon: SuccessApp,
    suffix: "%"
  },

  {
    statFunction: offerRate,
    statName: "Offers",
    icon: Medal,
    suffix: "%"
  },
  {
    statFunction: responseRate,
    statName: "Response Rate",
    icon: SuccessApp,
    suffix: "%"
  },
  {
    statFunction: averageResponseDays,
    statName: "Average Response Days",
    icon: Calendar,
    suffix: " days"
  }
];

const Analytics = () => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;

  const { applications, isLoading, errorMessage } = useApplications(); // Pre-filter applications by status before passing to search


  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4 relative">
      {isMobile && <Header />}
      <main className="flex flex-col pb-10 gap-6">
        <h2 className="mt-6 text-page-title text-on-surface">
          Performance Ledger
        </h2>
        <p className="mt-4 text-body-lg text-on-surface-secondary">
          Measuring your application journey with architectural precision.
        </p>

        <div className="flex flex-col justify-between gap-6">
          {stats.map((stat, index) => {
            return (
              <StatCard
                key={index}
                applications={applications}
                statFunction={stat.statFunction}
                statName={stat.statName}
                primaryCard={stat.primaryCard}
                icon={stat.icon}
                index={index}
                suffix={stat.suffix}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Analytics;
