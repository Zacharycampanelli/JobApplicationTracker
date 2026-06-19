import type { ChartData, ChartOptions } from "chart.js";
import VerticalBarChart from "../../../components/charts/VerticalBarChart";
import type { ApplicationVelocityItem } from "../../../utils/getAnalyticsData";

type ApplicationVelocityChartProps = {
  data: ApplicationVelocityItem[];
  className?: string;
};

export const ApplicationVelocityChart = ({
  data,
  className
}: ApplicationVelocityChartProps) => {
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
    <section className={className}>
      <h3 className="text-page-title text-on-surface mb-8 text-center">
        Application Velocity
      </h3>
      <VerticalBarChart data={chartData} options={options} />
    </section>
  );
};
