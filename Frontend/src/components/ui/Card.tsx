import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type CardProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const Card = <T extends ElementType = "div">({
  as,
  children,
  className = "",
  ...props
}: CardProps<T>) => {
  const Component = as || "div";

  return (
    <Component
      className={twMerge(
        "rounded-2xl bg-surface-container-lowest p-6 shadow-card",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
