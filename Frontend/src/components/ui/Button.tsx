import {
  forwardRef,
  type ReactElement,
  type ButtonHTMLAttributes
} from "react";
import { twMerge } from "tailwind-merge";

const variantStyles = {
  primary: "text-surface-container-lowest",
  secondary:
    "bg-surface-container-high text-on-surface enabled:hover:bg-surface-container-lowest",
  ghost: "text-on-surface-variant enabled:hover:bg-surface-container-high",
  danger: "bg-error-container text-on-surface enabled:hover:bg-error enabled:hover:text-surface-bright"
};

const sizeStyles = {
  sm: "h-9 rounded-control px-3 text-label-sm",
  md: "h-10 rounded-control px-4 text-action",
  lg: "h-12 rounded-control px-5 text-action"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  icon?: ReactElement;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      children,
      className = "",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const isPrimary = variant === "primary";

    const classes = twMerge(
      "inline-flex items-center justify-center gap-2",
      "transition-[color,background-color,opacity] duration-150",
       "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      sizeStyles[size],
      variantStyles[variant],
      isPrimary && "btn-gradient",
      className
    );

    return (
      <button className={classes} {...props} disabled={disabled} ref={ref}>
        {icon && <span className="flex items-center">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
