import Header from "../components/layout/Header";
import { useBreakpoint } from "../utils/useBreakpoint";
import Resume from "../assets/images/resume.svg?react";
import SuccessApp from "../assets/images/successApp.svg?react";
import Medal from "../assets/images/medal.svg?react";
import Calendar from "../assets/images/calendar.svg?react";
import Chat from "../assets/images/chat.svg?react";
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
import AnalyticsMetricCard from "../features/analytics/components/AnalyticsMetricCard";

const getAnalyticsStats = (applications: JobApplication[]) => [
  {
    title: "RESPONSE RATE",
    value: responseRate(applications),
    icon: Chat,
    suffix: "%"
  },
  {
    title: "TOTAL APPLICATIONS",
    value: applicationCount(applications),
    icon: Resume,
    progressBar: true,
    variant: "compact"
  },

  {
    title: "INTERVIEWS",
    value: interviewRate(applications),
    icon: SuccessApp,
    progressBar: true,
    variant: "compact"
  },

  {
    title: "ACTIVE PIPELINE",
    value: activePipelineRate(applications),
    icon: Calendar,
    progressBar: true,
    suffix: "%",
    variant: "compact"
  },
  {
    title: "AVERAGE RESPONSE DAYS",
    value: averageResponseDays(applications),
    suffix: " days",
    variant: "compact"
  }
];

const Analytics = () => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;

  const { applications, isLoading, errorMessage } = useApplications(); // Pre-filter applications by status before passing to search
  const stats = getAnalyticsStats(applications);

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
        {isMobile && (
          <>
            <AnalyticsMetricCard
              title={stats[0].title}
              value={stats[0].value}
              suffix={stats[0].suffix}
              icon={stats[0].icon}
              progressBar={true}
              emphasis="highlight"
              className="bg-primary text-white"
            />
            <section className="grid grid-cols-2 gap-3">
              {stats.slice(1).map((stat, index) => {
                return (
                  <AnalyticsMetricCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    suffix={stat.suffix}
                    variant="compact"
                    // icon={stat.icon}
                    className={stat.className}
                    index={index}
                  />
                );
              })}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Analytics;
