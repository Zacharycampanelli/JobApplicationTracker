import type { ReactElement, ButtonHTMLAttributes } from "react";

const variantStyles = {
  primary: "bg-primary text-white hover:opacity-90",
  secondary: "bg-surface-container-high text-on-surface",
  ghost: "text-on-surface-variant hover:bg-surface-container-high",
  danger: "bg-error-container text-on-surface"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantStyles;
  icon?: ReactElement;
};

const Button = ({
  variant = "primary",
  icon,
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const isPrimary = variant === "primary";
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition",
    variantStyles[variant],
    isPrimary && "btn-gradient",
    className
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={classes} {...props}>
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
