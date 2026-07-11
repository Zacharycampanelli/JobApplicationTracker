import type { ComponentType, ReactNode, SVGProps } from "react";

type UserPreferenceItemProps = {
  preference: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  mode: "toggle" | "dropdown" | undefined;
  isDangerous?: boolean;
  children: ReactNode;
  className?: string;
};

const UserPreferenceItem = ({
  preference,
  icon: Icon,
  children,
  className
}: UserPreferenceItemProps) => {
  return (
    <div
      className={`bg-surface-container-low justify-between flex w-full px-8 py-6 ${className ?? ""}`}
    >
      <div className="flex items-center gap-6 w-full">
        <Icon width={24} height={24} fill="#566166" />
        <span className="text-card-title text-action">{preference}</span>
      </div>

      {children}
    </div>
  );
};

export default UserPreferenceItem;
