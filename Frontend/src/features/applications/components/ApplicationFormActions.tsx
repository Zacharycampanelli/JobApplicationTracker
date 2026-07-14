import { useBreakpoint } from "../../../utils/useBreakpoint";
import Button from "../../../components/ui/Button";

type ApplicationFormActionsProps = {
  isSubmitting: boolean;
  newOrEdit: "new" | "edit";
  onCancel: (isDirty: boolean) => void;
};

const ApplicationFormActions = ({
  isSubmitting,
  newOrEdit,
  onCancel
}: ApplicationFormActionsProps) => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;

  return (
    <div className="flex flex-col w-full justify-between md:flex-row-reverse md:justify-end md:items-center gap-2 lg:gap-3 mt-4 md:leading-6">
      <Button
        type="submit"
        size={isMobile ? "lg" : "md"}
        disabled={isSubmitting}
        className="w-full px-2 py-6 lg:px-4"
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
        className="w-full px-2 py-6 lg:px-4"
      >
        Cancel
      </Button>
    </div>
  );
};

export default ApplicationFormActions;
