import type { ReactNode } from "react";

type ErrorStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
  compact?: boolean;
};
const ErrorState = ({
  title = "Something went wrong",
  message,
  action,
  compact = false
}: ErrorStateProps) => {
  return (
    <div
      role="alert"
      className={compact
        ? "flex min-h-24 flex-col items-center justify-center text-center"
        : "flex min-h-64 flex-col items-center justify-center text-center"
      }
    >
      <h2 className="text-card-title text-error">{title}</h2>
      <p className="mt-2 max-w-md text-body-md text-on-surface-secondary">
        {message}
        </p>
        {action && (
            <div className="mt-5">{action}</div>
        )}
    </div>
  )
}

export default ErrorState