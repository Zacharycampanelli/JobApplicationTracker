import type { ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

type HorizontalBarChartProps = {
  data: ChartData<"bar">;
  options?: ChartOptions<"bar">;
  className?: string;
};
const HorizontalBarChart = ({
  data,
  options,
  className
}: HorizontalBarChartProps) => {
  return (
    <div className={className}>
      <Bar
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y",
          ...options
        }}
      />
    </div>
  );
};
export default HorizontalBarChart;
