import Card from "./Card";
import ResumeIcon from "../../assets/images/resume.svg?react";
import { useState } from "react";
import type { Resume } from "../../types/types";
import SingleResume from "./SingleResume";

const ResumeManager = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [empty, setEmpty] = useState(true);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [selectedResume, setSelectedResume] = useState<number | null>(null);
  return (
    <Card className="mt-8 bg-surface-container">
      <div className="flex flex-col">
        <span className="flex justify-start items-center">
          <ResumeIcon />
          <h2 className="text-card-title ml-2">Targeted Assets</h2>
        </span>
      { isLoading ?
        (<p>Loading...</p>)
      : error ?
      (<p>Error: {error}</p>)
      :
      empty ?
      (<p>No resumes uploaded</p>) :
        resumes && resumes.map((resume) => (
          <SingleResume key={resume.id} resume={resume} selected={selectedResume === resume.id ? true : false}/>
        ))
      }
      
      </div>
    </Card>
  );
};

export default ResumeManager;
