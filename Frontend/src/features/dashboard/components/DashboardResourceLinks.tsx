const resourceLinks = [
  {
    url: "https://www.careeronestop.org/JobSearch/Resumes/ResumeGuide/introduction.aspx",
    label: "Improve your résumé",
    description: "Help with résumé structure and content."
  },
  {
    url: "https://www.careeronestop.org/JobSearch/Interview/interview-and-negotiate.aspx",
    label: "Prepare for Interviews",
    description: "Prepare answers, research employers, and plan follow-ups."
  },
  {
    url: "https://www.careeronestop.org/Toolkit/Wages/find-salary.aspx",
    label: "Research salaries",
    description: "Compare pay by occupation and location."
  },
  {
    url: "https://www.bls.gov/ooh/",
    label: "Explore career outlooks",
    description: "Research duties, qualifications, pay, and projected growth."
  }
];

const DashboardResourceLinks = () => {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-surface-container p-6 min-w-[90%] w-full">
      <h2 className="flex items-center gap-2 text-card-title text-on-surface">
        Useful resources
      </h2>
      {resourceLinks.map((resource) => (
        <>
          <a href={resource.url} key={resource.url} className="text-action underline hover:cursor-pointer">
            {resource.label}
          </a>
          <span className="text-balance">{resource.description}</span>
        </>
      ))}
    </div>
  );
};

export default DashboardResourceLinks;
