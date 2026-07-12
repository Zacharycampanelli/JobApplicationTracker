import Header from "../components/layout/Header";
import { useBreakpoint } from "../utils/useBreakpoint";
import { useApplications } from "../utils/useApplications";
import AnalyticsMetricCard from "../features/analytics/components/AnalyticsMetricCard";
import PipelineDistribution from "../features/analytics/components/PipelineDistribution";
import { getAnalyticsData } from "../utils/getAnalyticsData";
import { ApplicationVelocityChart } from "../features/analytics/components/ApplicationVelocityChart";
import SourceBreakdownChart from "../features/analytics/components/SourceBreakdownChart";
import Application from "../assets/images/addApplication.svg?react";
import Calendar from "../assets/images/calendar.svg?react";
import DayIndicator from "../components/shared/DayIndicator";
import EmptyState from "../components/shared/EmptyState";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router";
import LoadingState from "../components/shared/LoadingState";
import ErrorState from "../components/shared/ErrorState";

const Analytics = () => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;
  const navigate = useNavigate();
  const { applications, isLoading, errorMessage } = useApplications();
  const analyticsData = getAnalyticsData(applications);

  if (isLoading) return <LoadingState message="Loading analytics..." />;
  if (errorMessage) return <ErrorState message={errorMessage} />;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface md:px-6 py-4 relative">
      {isMobile && <Header />}
      <main className="flex flex-col pb-10 gap-6 md:gap-8">
        <h2 className="mt-6 text-page-title text-on-surface">
          Performance Ledger
        </h2>
        <p className="mt-4 text-body-lg text-on-surface-secondary">
          Measuring your application journey with architectural precision.
        </p>
        {applications.length > 0 ? (
          <>
            <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] lg:items-stretch">
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4 lg:auto-rows-[8rem]">
                <AnalyticsMetricCard
                  title={analyticsData.stats[0].title}
                  value={analyticsData.stats[0].value}
                  suffix={analyticsData.stats[0].suffix}
                  icon={Application}
                  className="col-span-2 min-h-40 md:min-h-44 lg:row-span-2 lg:min-h-0"
                />

                {analyticsData.stats.slice(1).map((stat) => (
                  <AnalyticsMetricCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    suffix={stat.suffix}
                    variant="compact"
                    className="lg:min-h-0"
                  />
                ))}
              </div>

              <PipelineDistribution
                data={analyticsData.pipelineDistribution}
                className="mt-12 md:mt-0 lg:h-full lg:p-4"
              />
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <ApplicationVelocityChart
                data={analyticsData.applicationVelocity}
              />
              <SourceBreakdownChart data={analyticsData.sourceBreakdown} />
            </section>
            <AnalyticsMetricCard
              title="Peak Activity"
              value={analyticsData.peakActivity.label}
              description={
                analyticsData.peakActivity.count === 0
                  ? "Add applications to reveal your busiest day."
                  : `${analyticsData.peakActivity.count} applications submitted on this day`
              }
              icon={Calendar}
              className="mt-10"
            >
              <DayIndicator activeDay={analyticsData.peakActivity.label} />
            </AnalyticsMetricCard>
          </>
        ) : (
          <EmptyState
            title="No applications yet"
            description="Add your first application to view analytics data."
            action={
              <Button onClick={() => navigate("/applications/add")}>
                Add application
              </Button>
            }
          />
        )}
      </main>
    </div>
  );
};

export default Analytics;
