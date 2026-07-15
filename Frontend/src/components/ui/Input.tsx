import { useState, type InputHTMLAttributes, type ReactElement } from "react";
import Unlock from "../../assets/images/unlock.svg?react";
import Lock from "../../assets/images/lock.svg?react";
import { twMerge } from "tailwind-merge";

const sizeStyles = {
  sm: "h-9 rounded-control text-body-md",
  md: "h-10 rounded-control text-body-md",
  lg: "h-12 rounded-control text-body-lg"
};

type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> & {
  label?: string;
  error?: string;
  type?: "text" | "password" | "email" | "number" | "search" | "date" | "file";
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  size?: keyof typeof sizeStyles;
};

const Input = ({
  label,
  error,
  startIcon,
  endIcon,
  type = "text",
  size = "md",
  disabled = false,
  className = "",
  id,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const hasEndIcon = Boolean(endIcon || isPassword);
  const baseInputStyles =
    "w-full rounded-control bg-surface-container-low px-3 " +
    "text-on-surface placeholder:text-on-surface-variant " +
    "outline-none transition-colors duration-150 " +
    "focus:ring-2 focus:ring-primary/30 " +
    "disabled:cursor-not-allowed disabled:opacity-50";
  const classes = twMerge(
    baseInputStyles,
    !error && "enabled:hover:bg-surface-container-high",
    startIcon && "pl-10",
    hasEndIcon && "pr-10",
    sizeStyles[size],
    error && "bg-error-container text-on-surface",
    className
  );

  const togglePassword = () => setShowPassword((prev) => !prev);

  let endAdornment = null;

  if (isPassword) {
    endAdornment = (
      <button
        type="button"
        disabled={disabled}
        onClick={togglePassword}
        className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2
    items-center justify-center rounded-control
    text-on-surface-variant
    transition-colors duration-150
    enabled:hover:bg-surface-container-high
    enabled:hover:text-on-surface
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-primary
    disabled:cursor-not-allowed
    disabled:opacity-50"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <Unlock /> : <Lock />}
      </button>
    );
  } else if (endIcon) {
    endAdornment = (
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        {endIcon}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-label-md text-on-surface">
          {label}
        </label>
      )}
      <div className="relative">
        {startIcon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            {startIcon}
          </div>
        )}
        <input
          id={id}
          type={inputType}
          className={classes}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error && id ? `${id}-error` : undefined}
          {...props}
        />
        {endAdornment}
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

export default Input;
