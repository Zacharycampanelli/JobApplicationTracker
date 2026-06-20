import Header from "../components/layout/Header";
import { useBreakpoint } from "../utils/useBreakpoint";

import { useApplications } from "../utils/useApplications";
import AnalyticsMetricCard from "../features/analytics/components/AnalyticsMetricCard";
import PipelineDistribution from "../features/analytics/components/PipelineDistribution";
import { getAnalyticsData } from "../utils/getAnalyticsData";
import { ApplicationVelocityChart } from "../features/analytics/components/ApplicationVelocityChart";
import SourceBreakdownChart from "../features/analytics/components/SourceBreakdownChart";
import Appplication from "../assets/images/addApplication.svg?react";
import Calendar from "../assets/images/calendar.svg?react";

const Analytics = () => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;

  const { applications, isLoading, errorMessage } = useApplications();
  const analyticsData = getAnalyticsData(applications);

  if (isLoading) return <p>Loading...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;

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
              title={analyticsData.stats[0].title}
              value={analyticsData.stats[0].value}
              suffix={analyticsData.stats[0].suffix}
              icon={Appplication}
            />
            <section className="grid grid-cols-2 gap-3">
              {analyticsData.stats.slice(1).map((stat) => {
                return (
                  <AnalyticsMetricCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                );
              })}
            </section>
          </>
        )}

        <PipelineDistribution
          data={analyticsData.pipelineDistribution}
          className="mt-18"
        />
        <ApplicationVelocityChart
          data={analyticsData.applicationVelocity}
          className="mt-10"
        />
        <SourceBreakdownChart
          data={analyticsData.sourceBreakdown}
          className="mt-10"
        />

        <AnalyticsMetricCard
          key={analyticsData.peakActivity.label}
          title={"Peak Activity"}
          value={analyticsData.peakActivity.label}
          description={
            analyticsData.peakActivity.count === 0
              ? "Add applications to reveal your busiest day."
              : `${analyticsData.peakActivity.count} applications submitted on this day`
          }
          icon={Calendar}
        />
      </main>
    </div>
  );
};

export default Analytics;
