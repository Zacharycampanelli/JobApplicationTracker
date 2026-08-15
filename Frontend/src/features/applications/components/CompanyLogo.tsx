import { useState } from "react";

import { getInitials } from "../../../utils/getInitials";

type CompanyLogoProps = {
  url?: string;
  company: string;
};

const CompanyLogo = ({ url, company }: CompanyLogoProps) => {
  const [imageError, setImageError] = useState(false);

  const faviconUrl = url
    ? `https://www.google.com/s2/favicons?domain=${url}&sz=128`
    : null;

  if (!faviconUrl || imageError) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-high">
        <span className="text-body-md font-semibold">
          {getInitials(company)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-high">
      <img
        src={faviconUrl}
        alt={`${company} logo`}
        className="w-6 h-6"
        onError={() => setImageError(true)}
      />
    </div>
  );
};
export default CompanyLogo;
