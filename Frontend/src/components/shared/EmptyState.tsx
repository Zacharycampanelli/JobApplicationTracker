import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
};

const EmptyState = ({ title, description, action, compact = false }: EmptyStateProps) => {
  return (
    <div role="region" aria-labelledby="empty-state-title" className={compact
      ? "flex flex-col items-center rounded-card border border-dashed border-outline-variant bg-surface-container-low min-h-36 px-4 py-6 text-center"
      : "flex flex-col items-center rounded-card border border-dashed border-outline-variant bg-surface-container-low min-h-64 px-6 py-10 text-center"
    }>
      <h2 id="empty-state-title" className="text-card-title text-on-surface">{title}</h2>

      <p className="mt-2 max-w-md text-body-md text-on-surface-secondary">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
