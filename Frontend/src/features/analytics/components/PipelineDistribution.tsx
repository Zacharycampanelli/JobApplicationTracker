import type { ChartData, ChartOptions } from "chart.js";
import { useBreakpoint } from "../../../utils/useBreakpoint";
import DonutChart from "../../../components/charts/DonutChart";
import HorizontalBarChart from "../../../components/charts/HorizontalBarChart";
import type { PipelineDistributionItem } from "../../../utils/getAnalyticsData";
import Card from "../../../components/ui/Card";

type PipelineDistributionProps = {
  data: PipelineDistributionItem[];
  className?: string;
};

const PipelineDistribution = ({
  data,
  className
}: PipelineDistributionProps) => {
  const isTabletUp = useBreakpoint("md");

  const chartData: ChartData<"doughnut" | "bar"> = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        borderWidth: 0,
        backgroundColor: data.map((item) => item.color)
      }
    ]
  };

  const donutOptions: ChartOptions<"doughnut"> = {
    cutout: "70%",
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const barOptions: ChartOptions<"bar"> = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  const totalApplications = data.reduce((total, item) => total + item.value, 0);

  return (
    <Card className={className}>
      <h3 className="text-page-title text-on-surface mb-8 text-center">
        Pipeline Distribution
      </h3>
      {isTabletUp ? (
        <HorizontalBarChart
          data={chartData as ChartData<"bar">}
          options={barOptions}
        />
      ) : (
        <div className="mx-auto flex w-full flex-col items-center">
          <div className="relative size-56">
            <DonutChart
              data={chartData as ChartData<"doughnut">}
              options={donutOptions}
              className="w-full h-full"
            />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-card-title text-on-surface">
                {totalApplications}
              </span>
              <span className="text-label-sm uppercase text-on-surface-secondary">
                Total Apps
              </span>
            </div>
          </div>
          <ul className="mt-8 flex w-full max-w-64 flex-col gap-4">
            {data.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{backgroundColor: item.color}} />
                  <span className="text-body-md text-on-surface-secondary">
                    {item.label}
                  </span>
                </div>
                <span className="text-body-md font-semibold text-on-surface">
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default PipelineDistribution;
