import Card from "../ui/Card";
import type { JobApplication } from "../../types/types";
import { twMerge } from "tailwind-merge";
import type { ComponentType, SVGProps } from "react";
type StatCardProps = {
  applications: JobApplication[];
  statFunction: (applications: JobApplication[]) => number;
  statName: string;
  primaryCard?: boolean;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  index?: number;
  suffix?: string;
  className?: string;
};

const StatCard = ({
  applications,
  statFunction,
  statName,
  primaryCard,
  icon: Icon,
  index,
  suffix,
  className
}: StatCardProps) => {
  let iconColor = "text-primary";
  let background = "bg-primary-container";

  if (Icon && index !== undefined && index % 2 === 0) {
    iconColor = "text-primary-container";
    background = "bg-primary";
  }

  return (
    <Card
      className={twMerge(
        primaryCard
          ? "bg-primary-container flex-2 shadow-sm"
          : "bg-surface-container-low flex-1 shadow-sm",
        "min-w-[90%] md:min-w-0",
        className
      )}
    >
      <div className="flex justify-between">
        <h4
          className={`${primaryCard ? "text-primary" : "text-on-surface"} text-body-lg`}
        >
          {statName}
        </h4>
        {Icon && (
          <div
            className={`rounded-xl p-3 ${background} size-10 flex justify-center items-center`}
          >
            <Icon className={`size-4 fill-current ${iconColor}`} />{" "}
          </div>
        )}
      </div>
      <span
        className={`${primaryCard ? "text-primary text-[32px]" : "text-on-surface text-[24px]"}`}
      >
        {statFunction(applications)} {suffix}
      </span>
      {primaryCard ? (
        <progress
          className="w-full h-4 rounded-full overflow-hidden appearance-none [&::-webkit-progress-bar]:bg-primary/10 [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary/10 [&::-moz-progress-value]:bg-primary "
          max="100"
          value={statFunction(applications).toLocaleString()}
        >
          {statFunction(applications)} {suffix}
        </progress>
      ) : (
        ""
      )}
    </Card>
  );
};

export default StatCard;
