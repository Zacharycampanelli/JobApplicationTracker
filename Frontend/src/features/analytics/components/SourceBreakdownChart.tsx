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
    <Card className={className}>
      <h3 className="mb-8 text-center text-page-title text-on-surface">
        Source Breakdown
      </h3>
      <HorizontalBarChart
        data={chartData}
        options={options}
        className="w-full h-full"
      />
    </Card>
  );
};

export default SourceBreakdownChart;
