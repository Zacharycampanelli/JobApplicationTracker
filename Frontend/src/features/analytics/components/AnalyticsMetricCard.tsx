import type { ComponentType, SVGProps, ReactNode } from "react";
import Card from "../../../components/ui/Card";
import { twMerge } from "tailwind-merge";

type AnalyticsMetricCardProps = {
  title: string;
  value: number | string;
  suffix?: string;
  description?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  variant?: "featured" | "compact";
  emphasis?: "default" | "highlight";
  progressBar?: boolean;
  index?: number;
  className?: string;
  children?: ReactNode; 
};

const variantStyles = {
  featured: "p-6 min-h-54",
  compact: "p-4 min-h-32"
};

const emphasisStyles = {
  default: {
    card: "bg-surface-container-lowest text-on-surface",
    title: "text-on-surface-secondary",
    value: "text-on-surface",
    description: "text-on-surface-secondary",
    progress:
      "[&::-webkit-progress-bar]:bg-primary/10 [&::-webkit-progress-value]:bg-primary"
  },
  highlight: {
    card: "bg-primary",
    title: "text-primary-container",
    value: "text-surface-bright",
    description: "text-primary-container",
    progress:
      "[&::-webkit-progress-bar]:bg-primary-container/30 [&::-webkit-progress-value]:bg-surface-bright [&::-moz-progress-bar]:bg-surface-bright [&::-moz-progress-bar]:bg-primary-container/30"
  }
};
const AnalyticsMetricCard = ({
  title,
  value,
  suffix,
  description,
  icon: Icon,
  variant = "featured",
  emphasis = "default",
  progressBar,
  index,
  className,
  children
}: AnalyticsMetricCardProps) => {
  let iconColor = "text-primary";
  let background = "bg-primary-container";

  if (Icon && index !== undefined && index % 2 === 0) {
    iconColor = "text-primary-container";
    background = "bg-primary";
  }

  const variantClassName = variantStyles[variant];
  const emphasisClassName = emphasisStyles[emphasis];

  return (
    <Card
      className={twMerge(
        "flex flex-col items-center justify-center gap-2 text-center",
        variantClassName,
        emphasisClassName.card,
        className
      )}
    >
      {Icon && (
        <span
          className={`rounded-xl p-3 m-2 size-12 flex justify-center items-center ${background} `}
        >
          <Icon className={`size-8 fill-current ${iconColor}`} />
        </span>
      )}
      <h3 className={`text-analytics-card ${emphasisClassName.value}`}>
        {value} {suffix || ""}
      </h3>
      <h4 className={`text-label-md ${emphasisClassName.title}`}>{title}</h4>
      <p className={`text-body-md ${emphasisClassName.description}`}>
        {description || ""}
      </p>
      {progressBar && (
        <progress
          className={twMerge(
            "w-[90%] h-2 rounded-full overflow-hidden appearance-none",
            emphasisClassName.progress
          )}
          max="100"
          value={typeof value === "number" ? value : 0}
        />
      )}
      {children}
    </Card>
  );
};

export default AnalyticsMetricCard;
