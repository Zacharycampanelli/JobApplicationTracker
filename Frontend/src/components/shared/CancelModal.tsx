import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useNavigate } from 'react-router';

type CancelModalProps = {
    isOpen: boolean;
    onClose: () => void;
    newLocation?: string;
    onConfirm?: () => void;
   
}

const CancelModal = ({isOpen, onClose, newLocation, onConfirm }: CancelModalProps) => {
    const navigate = useNavigate();
  return (
    <Modal
        title="Discard changes?"
        isOpen={isOpen}
        onClose={() => onClose()}
        titleClassName="text-error"
        footer={
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onClose();
                if (newLocation) {
                  navigate(newLocation);
                }
                else if (onConfirm) {
                  onConfirm();
                }
              }}
            >
              Yes
            </Button>
          </div>
        }
      >
        <p className="text-body-md text-on-surface">
          Are you sure you want to discard your changes?
        </p>
      </Modal>
  )
}

export default CancelModal