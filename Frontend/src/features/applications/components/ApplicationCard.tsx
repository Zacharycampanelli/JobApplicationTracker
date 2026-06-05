import { useNavigate } from "react-router";
import RightArrow from "../../../assets/images/rightArrow.svg?react";
import Button from "../../../components/ui/Button";
import CompanyLogo from "./CompanyLogo";
import StatusClassBadge from "./StatusClassBadge";
import type { JobApplication } from "../../../types/types";

type ApplicationCardProps = {
  app: JobApplication;
};

const ApplicationCard = ({ app }: ApplicationCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      key={app.id}
      className="group relative flex min-h-36 flex-col gap-2 rounded-2xl bg-surface-container-low p-4 shadow-sm hover:bg-surface-containers md:min-h-0"
    >
      <div className="flex items-start justify-between gap-4 md:items-center xl:flex-col xl:items-stretch">
        <div className="flex min-w-0 flex-1 items-start gap-4 xl:flex-col">
          {/* Tablet layout logo */}
          <div className="hidden md:block xl:hidden">
            <CompanyLogo url={app?.link || undefined} company={app.company} />
          </div>

          {/* Desktop layout logo + status */}
          <div className="hidden xl:flex xl:items-start xl:justify-between xl:w-full">
            <CompanyLogo url={app?.link || undefined} company={app.company} />
            <StatusClassBadge status={app.status} />
          </div>
          <div className="flex min-h-24 min-w-0 flex-1 flex-col justify-between md:block md:min-h-0 xl:min-h-[76px]">
            <div>
              <h3 className="text-card-title text-on-surface">{app.title}</h3>
              <p className="mt-1 text-card-meta text-on-surface-secondary">
                {app.company}
                {app.location ? ` • ${app.location}` : ""}
              </p>
            </div>

            {app.appliedAt && (
              <p className="mt-4 text-label-md text-on-surface-variant md:hidden">
                Applied: {new Date(app.appliedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        {app.appliedAt && (
          <div className="hidden shrink-0 text-left md:block md:min-w-28 xl:hidden">
            <p className="text-label-md text-on-surface-secondary uppercase">
              Applied
            </p>
            <p className="text-label-md text-on-surface-variant">
              {new Date(app.appliedAt).toLocaleDateString()}
            </p>
          </div>
        )}
        <StatusClassBadge status={app.status} className="xl:hidden" />
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate(`/applications/edit/${app.id}`)}
          className="group-hover:flex md:static absolute bottom-8 right-6 xl:hidden"
        >
          <RightArrow
            width={18}
            height={18}
            color="text-on-surface-secondary"
          />
        </Button>
        {app.appliedAt && (
          <div className="hidden border-t border-outline-variant pt-3 xl:flex xl:items-center xl:justify-between">
            <p className="text-label-md uppercase text-on-surface-variant">
              {new Date(app.appliedAt).toLocaleDateString()}
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(`/applications/edit/${app.id}`)}
              className="group-hover:flex md:static absolute bottom-8 right-6"
            >
              <RightArrow
                width={18}
                height={18}
                color="text-on-surface-secondary"
              />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
