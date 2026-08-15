import type { Ref } from "react";
import { useNavigate } from "react-router";

import Handle from "../../../assets/images/handle.svg?react";
import RightArrow from "../../../assets/images/rightArrow.svg?react";
import Button from "../../../components/ui/Button";
import type { JobApplication } from "../../../types/types";
import CompanyLogo from "./CompanyLogo";
import StatusClassBadge from "./StatusClassBadge";

type ApplicationCardProps = {
  app: JobApplication;
  dragHandleRef?: Ref<HTMLButtonElement>;
  showStatus?: boolean;
};

const ApplicationCard = ({
  app,
  dragHandleRef,
  showStatus = false
}: ApplicationCardProps) => {
  const navigate = useNavigate();

  const formatDateOnly = (date: string) => {
    const [year, month, day] = date.slice(0, 10).split("-");
    return `${Number(month)}/${Number(day)}/${year}`;
  };

  return (
    <div className="group flex w-full flex-col gap-3 rounded-card
     bg-surface-container-low p-4 shadow-sm
     transition-[background-color,box-shadow,transform] duration-150
     hover:-translate-y-0.5
     hover:bg-surface-container-high
     hover:shadow-raised
     focus-within:ring-2
     focus-within:ring-primary
     focus-within:ring-offset-2
     focus-within:ring-offset-surface
     ">
      <div className="flex items-start gap-4">
        <div className="flex shrink-0 flex-col items-center gap-2">
          {dragHandleRef && (
            <Button
              ref={dragHandleRef}
              type="button"
              aria-label={`Drag ${app.company} application`}
              className="cursor-grab touch-none px-2 text-on-surface-variant active:cursor-grabbing"
              variant="ghost"
              size="sm"
            >
              <Handle />
            </Button>
          )}
          <CompanyLogo url={app.link || undefined} company={app.company} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-card-title text-on-surface">{app.title}</h3>
          <p className="mt-1 text-label-md text-on-surface-secondary">
            {app.company}
          </p>
          {showStatus && (
            <StatusClassBadge className="mt-3 inline-flex" status={app.status} />
          )}
        </div>
      </div>
      <div className="border-t border-outline-variant pt-3">
        <div className="flex justify-between items-center">
          {app.appliedAt && (
            <p className="text-label-md uppercase text-on-surface-variant">
              Applied: {formatDateOnly(app.appliedAt)}
            </p>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(`/applications/edit/${app.publicId}`)}
            aria-label={`Edit ${app.company} application`}
            className="
            shrink-0
            group-hover:bg-surface-container-lowest
            group-hover:text-primary
            "
          >
            <RightArrow width={18} height={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
