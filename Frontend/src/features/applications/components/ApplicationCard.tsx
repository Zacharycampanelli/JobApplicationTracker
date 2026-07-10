import type { Ref } from "react";
import { useNavigate } from "react-router";
import RightArrow from "../../../assets/images/rightArrow.svg?react";
import Button from "../../../components/ui/Button";
import CompanyLogo from "./CompanyLogo";
import type { JobApplication } from "../../../types/types";
import Handle from "../../../assets/images/handle.svg?react";

type ApplicationCardProps = {
  app: JobApplication;
  dragHandleRef?: Ref<HTMLButtonElement>;
};

const ApplicationCard = ({ app, dragHandleRef }: ApplicationCardProps) => {
  const navigate = useNavigate();

  const formatDateOnly = (date: string) => {
    const [year, month, day] = date.slice(0, 10).split("-");
    return `${Number(month)}/${Number(day)}/${year}`;
  };

  return (
    <div className="group flex w-full flex-col gap-3 rounded-2xl bg-surface-container-low p-4 shadow-sm transition-colors hover:bg-surface-container">
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
            onClick={() => navigate(`/applications/edit/${app.id}`)}
            className="shrink-0"
          >
            <RightArrow width={18} height={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
