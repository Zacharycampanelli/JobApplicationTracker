import AddApplicationForm from "../components/ui/AddApplicatiolnForm";
import Header from "../components/layout/Header";
import { useBreakpoint } from "../utils/useBreakpoint";

const AddApplication = () => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4">
      {isMobile && <Header />}
      <h2 className="mt-6 mb-6 text-auth-title text-on-surface">
        Add Application
      </h2>
      <AddApplicationForm />
    </div>
  );
};

export default AddApplication;
