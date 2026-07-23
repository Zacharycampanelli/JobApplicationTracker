import ApplicationCard from "../../features/applications/components/ApplicationCard";
import type { JobApplication } from "../../types/types";
import { useDraggable } from "@dnd-kit/react";

type DraggableApplicationCardProps = {
  app: JobApplication;
};

const DraggableApplicationCard = ({
  app
}: DraggableApplicationCardProps) => {
  const { ref, handleRef, isDragging } = useDraggable({
    id: app.publicId,
    type: "application",
    data: { status: app.status }
  });
  return (
    <div
      ref={ref}
      className={`transition-opacity duration-150
    ${isDragging ? "opacity-60" : "opacity-100"}`}
    >
      <ApplicationCard app={app} dragHandleRef={handleRef} />
    </div>
  );
};

export default DraggableApplicationCard;
