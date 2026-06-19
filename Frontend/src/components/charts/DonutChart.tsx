import { Doughnut } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

type DoughnutChartProps = {
  data: ChartData<"doughnut">;
  options?: ChartOptions<"doughnut">;
  className?: string;
};
const DoughnutChart = ({ data, options, className }: DoughnutChartProps) => {
  return (
    <div className={className}>
      <Doughnut data={data} options={options} />
    </div>
  );
};
export default DoughnutChart;
