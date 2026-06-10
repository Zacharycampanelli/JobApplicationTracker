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
  className?: string;
};

const StatCard = ({
  applications,
  statFunction,
  statName,
  primaryCard,
  icon: Icon,
  index,
  className
}: StatCardProps) => {
  let fill = "text-primary";
  let background = "bg-primary-container";

  if (Icon && index !== undefined && index % 2 === 0) {
    fill = "text-primary-container";
    background = "bg-primary";
  }

  console.log(background, fill);

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
          <div className={`rounded-xl p-3 ${background}`}>
            <Icon className={fill} />
          </div>
        )}
      </div>
      <span
        className={`${primaryCard ? "text-primary text-[32px]" : "text-on-surface text-[24px]"}`}
      >
        {statFunction(applications)}%
      </span>
      {primaryCard ? (
        <progress
          className="w-full h-4 rounded-full overflow-hidden appearance-none [&::-webkit-progress-bar]:bg-surface-container-lowest [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
          max="100"
          value={statFunction(applications).toLocaleString()}
        >
          {statFunction(applications) + "%"}
        </progress>
      ) : (
        ""
      )}
    </Card>
  );
};

export default StatCard;
