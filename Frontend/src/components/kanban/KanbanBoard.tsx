import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import type { JobApplication } from "../../types/types";
import type { JobStatus } from "../../types/types";
import KanbanColumn from "./KanbanColumn";
import { isSortable } from "@dnd-kit/react/sortable";

type KanbanBoardProps = {
  applications: JobApplication[];
  moveApplication: (applicationId: number, newStatus: JobStatus) => Promise<void>
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

const isJobStatus = (value: unknown): value is JobStatus => BOARD_COLUMNS.some((column) => column.status === value)

const KanbanBoard = ({ applications, moveApplication }: KanbanBoardProps) => {
  const applicationsByStatus = BOARD_COLUMNS.map((column) => ({
    ...column,
    applications: applications.filter((app) => app.status === column.status)
  }));

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;
    const {source, target} = event.operation;

    if (!isSortable(source)) return;

    const applicationId = Number(source.id);

    if(!Number.isInteger(applicationId)) return;

   
    const newStatus = isJobStatus(target?.id) ? target.id : source.group;

    if(!isJobStatus(newStatus)) return;

    if(source.initialGroup === newStatus) return;

    void moveApplication(applicationId, newStatus)

      
  };
  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto">
        {applicationsByStatus.map((column) => (
          
            <KanbanColumn
              key={column.status}
              title={column.title}
              status={column.status}
              applications={column.applications}
              className="w-[88vw] shrink-0 snap-start md:w-80 rounded-xl bg-surface-container p-4"
            />
       
        ))}
      </div>
    </DragDropProvider>
  );
};

export default KanbanBoard;
