import type { ReactNode } from "react";
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
};

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  closeAction,
  closeText
}: ModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = () => {
    if (closeAction) {
      navigate(closeAction);
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 px-4">
      <Card className="w-full max-w-md bg-surface-container-lowest">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="text-card-title text-on-surface">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={() => handleClose()}
            className="text-on-surface-secondary transition hover:text-on-surface"
          >
            X
          </button>
        </div>
        <div className="text-body-md text-on-surface-secondary">{children}</div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => handleClose()}>
            {closeText || ""}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Modal;
