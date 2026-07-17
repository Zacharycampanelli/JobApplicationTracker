import { useId, type ReactNode } from "react";
import { useNavigate, type To } from "react-router";
import Card from "./Card";
import Button from "./Button";

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  closeAction?: To;
  closeText?: string;
  titleClassName?: string;
  footer?: ReactNode;
};

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  closeAction,
  closeText = "Close",
  titleClassName = "",
  footer
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
      <Card role="dialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-md bg-surface-container-lowest">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2
            className={`text-card-title ${titleClassName || "text-on-surface"}`}
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
        <div className="text-body-md text-on-surface-secondary">{children}</div>

        <div className="mt-6 flex justify-end gap-3">
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
