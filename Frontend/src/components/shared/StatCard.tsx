import Card from "../ui/Card";
import type { JobApplication } from "../../types/types";
import { twMerge } from "tailwind-merge";

type StatCardProps = {
  applications: JobApplication[];
  statFunction: (applications: JobApplication[]) => number;
  statName: string;
  primaryCard?: boolean;
  className?: string;
};

const StatCard = ({
  applications,
  statFunction,
  statName,
  primaryCard,
  className
}: StatCardProps) => {
  return (
    <Card
      className={twMerge(
        primaryCard
          ? "bg-primary-container flex-2 shadow-sm"
          : "bg-surface-container-low flex-1 shadow-sm",
        className
      )}
    >
      <h4
        className={`${primaryCard ? "text-primary" : "text-on-surface"} text-body-lg`}
      >
        {statName}
      </h4>
      <span
        className={`${primaryCard ? "text-primary text-[32px]" : "text-on-surface text-[24px]"}`}
      >
        {statFunction(applications)}%
      </span>
      {primaryCard ? (
        <progress
          className="w-full h-4 rounded-full overflow-hidden appearance-none [&::-webkit-progress-bar]:bg-surface-container-lowest [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
          max="100"
          value={statFunction(applications)}
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
