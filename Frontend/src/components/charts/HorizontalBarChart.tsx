import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

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
          indexAxis: "y",
          ...options
        }}
      />
    </div>
  );
};
export default HorizontalBarChart;
