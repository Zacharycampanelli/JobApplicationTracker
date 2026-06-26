import { ReactNode, type ReactElement } from "react";
import Toggle from "../../../components/ui/Toggle";

type UserPreferenceItemProps = {
  preference: string;
  icon: ReactElement;
  mode: "toggle" | "dropdown";
  isDangerous?: boolean;
  children: ReactNode;
};

const UserPreferenceItem = ({
  preference,
  icon,
  mode,
  isDangerous,
  children
}: UserPreferenceItemProps) => {
  return (
    <div className="bg-surface-container-low">
      <div>
        {icon}
        <span className="text-body-md text-on-surface">{preference}</span>
      </div>

      {/* <Toggle checked={} */}
    </div>
  );
};

export default UserPreferenceItem;
