import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type CardProps<T extends ElementType = "div"> = {
    as?: T;
    children: ReactNode;
    className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">

const Card = <T extends ElementType = "div">({
    as,
    children, 
    className = "",
    ...props
}: CardProps<T>) => {
    const Component = as || "div";

  return (
    <Component
    className={[
        "rounded-2xl bg-surface-container-lowest p-6",
        className,
    ].join(" ")}
    {...props}
    >
        {children}
    </Component>
  )
}

export default Card