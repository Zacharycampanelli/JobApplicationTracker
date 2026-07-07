import type { JobApplication, JobStatus } from '../../types/types';
import KanbanItem from './KanbanItem';

type KanbanColumnProps = {
  title: string;
  status: JobStatus;
  applications: JobApplication[];
};

const KanbanColumn = ({ title, status, applications }: KanbanColumnProps) => {
  return (
    <div>
      <div className="flex justify-between">
        <h2>{title}</h2>
        <p>
          {
            applications.filter((app) => app.status === status)
              .length
          }
        </p>
      </div>
      {applications.filter((app) => app.status === status).map((app) => (
        <KanbanItem key={app.id} app={app} />
      ))}
    </div>
  );
};

export default KanbanColumn