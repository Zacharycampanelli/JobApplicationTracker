import { twMerge } from "tailwind-merge";

import { statusClassMap } from "../../../types/types";

type StatusClassBadgeProps = {
  status: string;
  className?: string;
};

const StatusClassBadge = ({ status, className }: StatusClassBadgeProps) => {
  return (
    <span
      className={twMerge(
        `shrink-0 rounded-full px-3 py-1 text-status ${
          statusClassMap[status] ?? "status-applied"
        }`,
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusClassBadge;
