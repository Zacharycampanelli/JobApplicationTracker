type AnalyticsMetricCardProps = {
  title: string;
  value: number | string;
  suffix?: string;
  description?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone?: "primary" | "neutral" | "success";
};
const AnalyticsMetricCard = ({title, value, suffix, description, icon, tone}: AnalyticsMetricCardProps) => {
  return (
    <div>AnalyticsMetricCard</div>
  )
}

export default AnalyticsMetricCard