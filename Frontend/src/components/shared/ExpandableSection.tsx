import { useState, type ReactNode } from "react";
import Button from "../ui/Button";
import ChevronDown from "../../assets/images/chevronDown.svg?react";

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

  return (
    <div className={className}>
      <Button
        icon={<ChevronDown width="16px" height="16px" />}
        variant="ghost"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {title}
      </Button>

      {isOpen && children}
    </div>
  );
};

export default ExpandableSection;
