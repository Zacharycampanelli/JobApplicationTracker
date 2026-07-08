import { useDroppable } from "@dnd-kit/react";
import type { JobApplication, JobStatus } from "../../types/types";
import DraggableApplicationCard from "./DraggableApplicationCard";

type KanbanColumnProps = {
  title: string;
  status: JobStatus;
  applications: JobApplication[];
  className: string;
};

const KanbanColumn = ({ title, status, applications, className }: KanbanColumnProps) => {
  const { ref, isDropTarget } = useDroppable({
    id: status,
    type: "column",
    accept: "application",
  });
  
  if(applications.length === 0) {
    return (
      <section ref={ref} className={className}>
        <h2 className="text-card-title text-on-surface mb-4">{title}{"    "} {applications.length}</h2>
        <div className="space-y-3 min-h-[60vh]">
          <p className="text-on-surface-variant text-sm">Drop an application here</p>
        </div>
      </section>
    )
  }
  return (
    <section ref={ref} className={className}>
      <h2>{title}</h2>
      <div className="space-y-3 min-h-[60vh]">
        {applications.map((app, index) => (
          <DraggableApplicationCard key={app.id} app={app} index={index} className={isDropTarget ? "bg-white" : ""} /> 
        ))}
      </div>
    </section>
  );
};

export default KanbanColumn;
