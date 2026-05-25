import AddApplicationForm from "../components/ui/AddApplicatiolnForm";
import Header from "../components/layout/Header";
import { useBreakpoint } from "../utils/useBreakpoint";
import { getResumes, uploadResume } from "../features/resumeApi";
import { useState } from "react";
import type { Resume } from "../types/types";

const AddApplication = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState(true);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4">
      {isMobile && <Header />}
      <h2 className="mt-6 mb-6 text-page-title text-on-surface">
        Add Application
      </h2>
      <AddApplicationForm />
    </div>
  );
};

export default AddApplication;
