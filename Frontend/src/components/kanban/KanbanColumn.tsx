import { useDroppable } from "@dnd-kit/react";
import type { JobApplication, JobStatus } from "../../types/types";
import DraggableApplicationCard from "./DraggableApplicationCard";

type KanbanColumnProps = {
  title: string;
  status: JobStatus;
  applications: JobApplication[];
  className: string;
};

const KanbanColumn = ({
  title,
  status,
  applications,
  className
}: KanbanColumnProps) => {
  const { ref, isDropTarget } = useDroppable({
    id: status,
    type: "column",
    accept: "application"
  });

  return (
    <section ref={ref} className={`${className} flex max-h-[70dvh] flex-col`}>
      <h2 className="mb-4 text-card-title text-on-surface">
        {title}{" "}
        <span className="text-on-secondary">({applications.length})</span>
      </h2>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
        {applications.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            Drop an application here
          </p>
        ) : (
          applications.map((app) => (
            <DraggableApplicationCard
              key={app.id}
              app={app}
              className={isDropTarget ? "bg-white" : ""}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default KanbanColumn;
