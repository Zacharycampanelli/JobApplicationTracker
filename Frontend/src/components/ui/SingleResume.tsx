import type { Resume } from "../../types/types";
import SelectInput from '../../assets/images/selectInput.svg?react';
import SelectedInput from '../../assets/images/selectedInput.svg?react';

type SingleResumeProps = {
    resume: Resume;
    selected: boolean;
}

const SingleResume = ({ resume, selected }: SingleResumeProps) => {
  return (
    <div className="flex">
        <span>
            {selected ? <SelectedInput /> : <SelectInput />}
        </span>
        <span className="flex">
        <h3 className="text-card-meta">
            {resume.name}
        </h3>
        <p className="text-label-md">
            {resume.createdAt}
        </p>
    </span>
    </div>
  )
}

export default SingleResume