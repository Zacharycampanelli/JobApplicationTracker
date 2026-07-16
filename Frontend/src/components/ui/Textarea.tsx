import type { TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

const Textarea = ({
  label,
  error,
  className = "",
  id,
  ...props
}: TextareaProps) => {
  const baseStyles =
    "min-h-28 w-full resize-y rounded-control " +
    "bg-surface-container-low px-3 py-2 " +
    "text-body-md text-on-surface " +
    "placeholder:text-on-surface-variant " +
    "outline-none transition-colors duration-150 " +
    "focus:ring-2 focus:ring-primary/30 " +
    "disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-label-md text-on-surface">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={twMerge(
          baseStyles,
          !error && "enabled:hover:bg-surface-container-high",
          error && "focus:ring-error bg-error-container text-on-surface",
          className
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error && id ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={id ? `${id}-error` : undefined}
          className="text-label-md text-error"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Textarea;
