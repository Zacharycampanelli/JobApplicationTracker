import {
  useState,
  type ComponentType,
  type ReactNode,
  type SVGProps
} from "react";

import ChevronDown from "../../../assets/images/chevronDown.svg?react";

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
  mode,

  children,
  className
}: UserPreferenceItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`bg-surface-container-low flex flex-col w-full px-8 py-4 h-fit ${className ?? ""}`}
    >
      <div className="flex justify-between items-center gap-6 w-full text-center min-h-18">
        <Icon width={24} height={24} fill="#566166" />
        <span className="text-card-title text-action">{preference}</span>

        {mode === "dropdown" ? (
          <button
            type="button"
            aria-label={preference}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="shrink-0"
          >
            <ChevronDown
              width="16"
              height="16"
              aria-hidden="true"
              className={`transition-transform duration-150 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        ) : (
          <>{children}</>
        )}
      </div>
      {mode === "dropdown" && isOpen && <div className="pt-4">{children}</div>}
    </div>
  );
};

export default UserPreferenceItem;
