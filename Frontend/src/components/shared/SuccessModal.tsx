import Modal from "../ui/Modal";

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  newLocation?: string;
};

const SuccessModal = ({ isOpen, onClose, newLocation }: SuccessModalProps) => {
  return (
    <Modal
      title="Success!"
      isOpen={isOpen}
      onClose={() => onClose()}
      closeAction={newLocation || undefined}
      closeText={newLocation ? "Okay!" : "Close"}
    >
      <p className="text-body-md text-on-surface">
        {newLocation ? "Application added successfully" : "Changes saved successfully"}
      </p>
    </Modal>
  );
};

export default SuccessModal;
