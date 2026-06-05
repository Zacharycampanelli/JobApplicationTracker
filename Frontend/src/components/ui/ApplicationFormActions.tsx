import { useBreakpoint } from "../../utils/useBreakpoint";
import Button from "./Button";

type ApplicationFormActionsProps = {
  isSubmitting: boolean;
  newOrEdit: "new" | "edit";
  onCancel: () => void;
};

const ApplicationFormActions = ({
  isSubmitting,
  newOrEdit,
  onCancel
}: ApplicationFormActionsProps) => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;
  return (
    <div className="flex w-full justify-between md:flex-row-reverse md:justify-end xl:flex-col gap-3">
      <Button
        type="submit"
        size={isMobile ? "lg" : "md"}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Submitting..."
          : newOrEdit === "new"
            ? "Add Application"
            : "Update Application"}
      </Button>
      <Button
        type="button"
        size={isMobile ? "lg" : "md"}
        variant="secondary"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
};

export default ApplicationFormActions;
