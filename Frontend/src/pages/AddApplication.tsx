import AddApplicationForm from "../components/ui/AddApplicatiolnForm";
import Header from "../components/layout/Header";
import ResumeManager from "../components/ui/ResumeManager";
import { useBreakpoint } from "../utils/useBreakpoint";


const AddApplication = () => {

  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4">
      {isMobile && <Header />}
      <h2 className="mt-6 mb-6 text-page-title text-on-surface">
        Add Application
      </h2>
      <AddApplicationForm />
      <ResumeManager />
    </div>
  );
};

export default AddApplication;
