import type { ApplicationActivity } from "../../../types/types";
import AddApplication from "../../../assets/images/addApplication.svg?react";
import Edit from "../../../assets/images/edit.svg?react";
import Arrows from "../../../assets/images/arrows.svg?react";
import Delete from "../../../assets/images/delete.svg?react";

const ActivityItem = ({ activity }: { activity: ApplicationActivity }) => {
  const getActivityIcon = (type: ApplicationActivity["type"]) => {
    switch (type) {
      case "CREATED":
        return <AddApplication aria-hidden="true" stroke="#4c56af" />;
      case "UPDATED":
        return <Edit aria-hidden="true" fill="#4c56af" />;
      case "STATUS_CHANGE":
        return <Arrows aria-hidden="true" fill="#4c56af" />;
      case "DELETED":
        return <Delete aria-hidden="true" fill="#4c56af" />;
      default:
        return <AddApplication aria-hidden="true" />;
    }
  };

  const getActivityMessage = (activity: ApplicationActivity) => {
    switch (activity.type) {
      case "CREATED":
        return `Added ${activity.title} at ${activity.company}`;
      case "UPDATED":
        return `Updated ${activity.title} at ${activity.company}`;
      case "STATUS_CHANGE":
        return `Moved ${activity.title} from ${activity.fromStatus} to ${activity.toStatus}`;
      case "DELETED":
        return `Deleted ${activity.title} at ${activity.company}`;
    }
  };

  const message = getActivityMessage(activity);

  return (
    <div className="flex gap-2 items-center">
        <div className="min-w-10 min-h-10 bg-white rounded-lg relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface-bright flex items-center justify-center shrink-0 mr-4">
        {getActivityIcon(activity.type)}
      </div>
        </div>
      <div className="flex flex-col">
        <h3 className="text-action">{activity.company}</h3>
        <p className="text-body-md">{message}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
