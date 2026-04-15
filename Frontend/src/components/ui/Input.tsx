import { useState, type InputHTMLAttributes, type ReactElement } from "react";

const sizeStyles = {
  sm: "h-9 text-sm rounded-md",
  md: "h-10 text-sm rounded-xl",
  lg: "h-12 text-base rounded-xl"
};

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  type?: "text" | "password" | "email" | "number" | "search";
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
    "w-full bg-surface-container-low text-body-md text-on-surface placeholder:text-on-surface-variant transition-colors outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed px-3";
  const classes = [
    baseInputStyles,
    startIcon ? "pl-10" : "",
    hasEndIcon ? "pr-10" : "",
    sizeStyles[size],
    error ? "bg-error-container text-on-error" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  const togglePassword = () => setShowPassword((prev) => !prev);

  let endAdornment = null;

  if (isPassword) {
    endAdornment = (
      <button
        type="button"
        onClick={togglePassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-label-md text-on-surface-variant"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    );
  } else if (endIcon) {
    endAdornment = (
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">{endIcon}</div>
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
        <p id={id ? `${id}-error` : undefined} className="text-label-md text-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
