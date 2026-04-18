type JobStatus =
  | "applied"
  | "reviewing"
  | "interviewing"
  | "offer"
  | "rejected";

type StatusBadgeProps = {
  status: JobStatus;
  variant?: "soft" | "solid";
};

const styles = {
  applied: "bg-surface-container-high text-on-surface-variant",
  reviewing: "bg-surface-container text-on-surface-variant",
  interviewing: "bg-primary-container text-primary",
  offer: "bg-success-container text-success",
  rejected: "bg-error-container text-error"
};

const labels = {
  applied: "Applied",
  reviewing: "Reviewing",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected"
};

const StatusBadge = ({ status, variant = "soft" }: StatusBadgeProps) => {
  const isSoft = variant === "soft";
  return (
    <span
      className={`
    inline-flex items-center rounded-full px-3 py-1 text-label-sm w-fit ${isSoft ? "" : "uppercase tracking-wide"} ${styles[status]}`}
    >
      {isSoft && (<span className="h-2 w-2 rounded-full bg-current opacity-70 mr-1.5" />)}
      {labels[status]}
    </span>
  );
};

export default StatusBadge;
