import type { ReactElement, ButtonHTMLAttributes } from "react";

const variantStyles = {
  primary: "text-white enabled:hover:opacity-90",
  secondary:
    "bg-surface-container-high text-on-surface enabled:hover:bg-surface-container-lowest",
  ghost: "text-on-surface-variant enabled:hover:bg-surface-container-high",
  danger: "bg-error-container text-on-surface enabled:hover:opacity-90"
};

const sizeStyles = {
  sm: "h-9 px-3 text-sm rounded-md",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-12 px-5 text-base rounded-xl"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  icon?: ReactElement;
};

const Button = ({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  disabled = false,
  ...props
}: ButtonProps) => {
  const isPrimary = variant === "primary";
  const classes = [
    "inline-flex items-center justify-center gap-2 font-medium transition",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    variantStyles[variant],
    sizeStyles[size],
    isPrimary && "btn-gradient",
    className
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={classes} {...props} disabled={disabled}>
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
