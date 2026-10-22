import { useId, type ReactNode } from "react";
import { useNavigate, type To } from "react-router";

import Button from "./Button";
import Card from "./Card";

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  closeAction?: To;
  closeText?: string;
  titleClassName?: string;
  footer?: ReactNode;
  width?: string;
  height?: string;
};

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  closeAction,
  closeText = "Close",
  titleClassName = "",
  footer,
  width,
  height
}: ModalProps) => {
  const navigate = useNavigate();
  const titleId = useId();

  if (!isOpen) return null;

  const handleClose = () => {
    if (closeAction) {
      navigate(closeAction);
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 px-4"
    onKeyDown={(event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    }}>
      <Card role="dialog" aria-modal="true" aria-labelledby={titleId} className={`flex flex-col max-h-[90dvh] overflow-hidden w-full bg-surface-container-lowest ${width ? width : "max-w-md"} ${height ? height : ""}`}>
        <div className="mb-6 flex items-start justify-between gap-4 shrink-0">
          <h2
            className={`min-w-0 flex-1 wrap-anywhere text-card-title ${titleClassName || "text-on-surface"}`}
            id={titleId}
          >
            {title}
          </h2>
          <Button
            autoFocus
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Close modal"
            onClick={handleClose}
            className="size-9 shrink-0 p-0 text-xl"
          >
            <span aria-hidden="true">×</span>
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto text-body-md text-on-surface-secondary ">{children}</div>

        <div className="mt-6 flex justify-end gap-3 shrink-0">
          {footer ?? (
            <Button onClick={handleClose}>
              {closeText}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Modal;
