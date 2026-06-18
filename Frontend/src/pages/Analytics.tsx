import { type ComponentType, type SVGProps } from "react";
import Header from "../components/layout/Header";
import { useBreakpoint } from "../utils/useBreakpoint";

import { useApplications } from "../utils/useApplications";
import AnalyticsMetricCard from "../features/analytics/components/AnalyticsMetricCard";
import PipelineDistribution from "../features/analytics/components/PipelineDistribution";
import { getAnalyticsData } from "../utils/getAnalyticsData";

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
            />
            <section className="grid grid-cols-2 gap-3">
              {analyticsData.stats.slice(1).map((stat, index) => {
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
        <PipelineDistribution data={analyticsData.pipelineDistribution} />
      </main>
    </div>
  );
};

export default Analytics;
