import type { ChartData, ChartOptions } from "chart.js";

import VerticalBarChart from "../../../components/charts/VerticalBarChart";
import Card from "../../../components/ui/Card";
import type { ApplicationVelocityItem } from "../../../utils/getAnalyticsData";

type ApplicationVelocityChartProps = {
  data: ApplicationVelocityItem[];
  className?: string;
};

export const ApplicationVelocityChart = ({
  data,
  className
}: ApplicationVelocityChartProps) => {
  const hasVelocityData = data.some((item) => item.value > 0);

  const chartData: ChartData<"bar"> = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: "#4c56af",
        borderRadius: 0
      }
    ]
  };

  const options: ChartOptions<"bar"> = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 1
        }
      }
    }
  };

  return (
    <Card className={`min-w-0 ${className ?? ""}`}>
      <h3 className="text-card-title text-on-surface mb-4 text-center xl:text-left">
        Application Velocity
      </h3>
      {hasVelocityData ? (
        <VerticalBarChart
          data={chartData}
          options={options}
          className="relative h-56 w-full min-w-0 max-w-full"
        />
      ) : (
        <p className="text-body-md text-on-surface-secondary">
          No application activity is available for this period.
        </p>
      )}
    </Card>
  );
};
