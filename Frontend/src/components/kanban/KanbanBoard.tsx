import type { JobApplication } from "../../types/types";
import type { JobStatus } from "../../types/types";

type KanbanBoardProps = {
  applications: JobApplication[];
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

const KanbanBoard = ({ applications }: KanbanBoardProps) => {
  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto">
      {BOARD_COLUMNS.map((column) => (
        <section className="w-[88vw] shrink-0 snap-start md:w-80">
          {/* column contents */}
          <KanbanColumn title={column.title} status={column.status} applications={applications} />
          <div className="flex justify-between">
            <h2>{column.title}</h2>
            <p>
              {
                applications.filter((app) => app.status === column.status)
                  .length
              }
            </p>
          </div>
        </section>
      ))}
    </div>
  );
};

export default KanbanBoard;
