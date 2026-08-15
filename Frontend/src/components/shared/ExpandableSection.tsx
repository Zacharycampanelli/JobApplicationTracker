import { useId, useState, type ReactNode } from "react";

import ChevronDown from "../../assets/images/chevronDown.svg?react";
import Button from "../ui/Button";

type ExpandableSectionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

const ExpandableSection = ({
  title,
  children,
  defaultOpen = false,
  className
}: ExpandableSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const sectionId = useId();
  const triggerId = `${sectionId}-trigger`;
  const contentId = `${sectionId}-content`;

  return (
    <div className={className}>
      <Button
        id={triggerId}
        variant="ghost"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className={`
        w-full justify-between
        ${isOpen ? "bg-surface-container-high text-primary" : ""}
      `}
      >
        <span>{title}</span>
        <ChevronDown
          width="16"
          height="16"
          aria-hidden="true"
          className={`
          transition-transform duration-150
          ${isOpen ? "rotate-180" : "rotate-0"}
        `}
        />
      </Button>
      {isOpen && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          className="mt-4"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
