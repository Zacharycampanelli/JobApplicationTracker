import { ReactNode, type ComponentType, type ReactElement } from "react";

type UserPreferenceItemProps = {
  preference: string;
  icon: ComponentType<{ className?: string }>;
  mode: "toggle" | "dropdown" | undefined;
  isDangerous?: boolean;
  children: ReactNode;
};

const UserPreferenceItem = ({
  preference,
  icon: Icon,
  mode,
  isDangerous,
  children
}: UserPreferenceItemProps) => {
  return (
    <div className="bg-surface-container-low justify-between flex w-full px-8 py-6">
      <div className="flex items-center gap-6 w-full">
        <Icon width={24} height={24} fill="#566166" />
        <span className="=text-card-title text-action">{preference}</span>
      </div>

      {children}
    </div>
  );
};

export default UserPreferenceItem;
