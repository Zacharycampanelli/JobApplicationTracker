import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

type VerticalBarChartProps = {
  data: ChartData<"bar">;
  options?: ChartOptions<"bar">;
  className?: string;
};

const VerticalBarChart = ({
  data,
  options,
  className
}: VerticalBarChartProps) => {
  return (
    <div className={className}>
      <Bar data={data} options={{
        responsive: true,
        maintainAspectRatio: false,
        ...options}} />
    </div>
  );
}

export default VerticalBarChart;