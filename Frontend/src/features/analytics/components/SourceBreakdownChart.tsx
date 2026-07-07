import type { ChartData, ChartOptions } from "chart.js";
import HorizontalBarChart from "../../../components/charts/HorizontalBarChart";
import type { SourceBreakdownItem } from "../../../utils/getAnalyticsData";
import Card from "../../../components/ui/Card";

type SourceBreakdownChartProps = {
  data: SourceBreakdownItem[];
  className?: string;
};

const SourceBreakdownChart = ({
  data,
  className
}: SourceBreakdownChartProps) => {
  const chartData: ChartData<"bar"> = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color),
        borderRadius: 6
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
        beginAtZero: true,
        ticks: {
          precision: 0
        },
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <Card className={`min-w-0 ${className ?? ""}`}>
      <h3 className="mb-8 text-center text-card-title text-on-surface">
        Source Breakdown
      </h3>
      {data.length === 0 ? (
        <p className="text-label-md text-on-surface-secondary">
          Add source details to unlock this chart.
        </p>
      ) : (
        <HorizontalBarChart
          data={chartData}
          options={options}
          className="relative h-56 w-full min-w-0 max-w-full"
        />
      )}
    </Card>
  );
};

export default SourceBreakdownChart;
