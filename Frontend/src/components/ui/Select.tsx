import type { SelectHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const sizeStyles = {
  sm: "h-9 text-body-md",
  md: "h-10 text-body-md",
  lg: "h-12 text-body-lg"
};

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
  label?: string;
  error?: string;
  placeholder?: string;
  size?: keyof typeof sizeStyles;
  options: SelectOption[];
};

const Select = ({
  label,
  error,
  placeholder,
  size = "md",
  options,
  disabled = false,
  className = "",
  id,
  ...props
}: SelectProps) => {
  const baseSelectStyles =
    "w-full appearance-none rounded-control bg-surface-container-low px-3 pr-10 " +
    "text-on-surface outline-none " +
    "transition-colors duration-150 " +
    "focus:ring-2 focus:ring-primary/30 " +
    "disabled:cursor-not-allowed disabled:opacity-50";
  const classes = twMerge(
    baseSelectStyles,
    !error && "enabled:hover:bg-surface-container-high",
    sizeStyles[size],
    error && "bg-error-container text-on-surface",
    className
  );

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-label-md text-on-surface">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={classes}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error && id ? `${id}-error` : undefined}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span
          className={twMerge(
            "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2",
            "text-on-surface-secondary transition-colors duration-150",
            disabled && "opacity-50"
          )}
        >
          ▾
        </span>
      </div>
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

export default Select;
