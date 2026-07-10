import ApplicationCard from "../../features/applications/components/ApplicationCard";
import type { JobApplication } from "../../types/types";
import { useDraggable } from "@dnd-kit/react";

type DraggableApplicationCardProps = {
  app: JobApplication;
  className?: string;
};

const DraggableApplicationCard = ({
  app,
  className
}: DraggableApplicationCardProps) => {
  const { ref, handleRef, isDragging } = useDraggable({
    id: app.id,
    type: "application",
    data: { status: app.status }
  });
  return (
    <div
      ref={ref}
      className={`${className ?? ""} ${isDragging ? "opacity-50" : ""}`}
    >
      <ApplicationCard app={app} dragHandleRef={handleRef} />
    </div>
  );
};

export default DraggableApplicationCard;
