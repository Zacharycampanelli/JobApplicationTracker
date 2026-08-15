import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { toast } from "sonner";

import type { JobApplication } from "../../types/types";
import type { JobStatus } from "../../types/types";
import KanbanColumn from "./KanbanColumn";

type KanbanBoardProps = {
  applications: JobApplication[];
  moveApplication: (
    applicationId: string,
    newStatus: JobStatus
  ) => Promise<void>;
};

type BoardColumn = {
  title: string;
  status: JobStatus;
};

const BOARD_COLUMNS: BoardColumn[] = [
  { title: "Applied", status: "APPLIED" },
  { title: "Interview", status: "INTERVIEW" },
  { title: "Offer", status: "OFFER" },
  { title: "Rejected", status: "REJECTED" }
];

const isJobStatus = (value: unknown): value is JobStatus =>
  BOARD_COLUMNS.some((column) => column.status === value);

const KanbanBoard = ({ applications, moveApplication }: KanbanBoardProps) => {
  const applicationsByStatus = BOARD_COLUMNS.map((column) => ({
    ...column,
    applications: applications.filter((app) => app.status === column.status)
  }));

  const handleDragEnd = async (event: DragEndEvent) => {
    if (event.canceled) return;
    const { source, target } = event.operation;

    const applicationId = source?.id;
    if (typeof applicationId !== "string") return;

    const newStatus = target?.id as JobStatus;
    if (!isJobStatus(newStatus)) return;

    try {
      await moveApplication(applicationId, newStatus);
      toast.success(`Application moved to ${newStatus}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update application status"
      );
    }
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex max-w-full gap-4 overflow-x-auto overscroll-x-contain pb-3">
        {applicationsByStatus.map((column) => (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            applications={column.applications}
            className="w-[90vw] shrink-0 rounded-xl bg-surface-container p-4 md:w-80"
          />
        ))}
      </div>
    </DragDropProvider>
  );
};

export default KanbanBoard;
