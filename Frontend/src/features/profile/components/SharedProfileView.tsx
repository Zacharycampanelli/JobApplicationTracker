type SharedProfileViewProps = {
  name: string;
  avatarUrl?: string | null;
  title?: string | null;
  location?: string | null;
  website?: string | null;
  linkedin?: string | null;
  summary?: string | null;
};

const SharedProfileView = ({
  name,
  avatarUrl,
  title,
  location,
  website,
  linkedin,
  summary
}: SharedProfileViewProps) => {
  return (
    <>
      {!avatarUrl && (
        <span className="flex justify-center items-center size-28 mx-auto rounded-full bg-surface-container-high text-page-title text-on-surface">
          {name?.charAt(0).toUpperCase() ?? "U"}
        </span>
      )}
      <div className="flex flex-col gap-4">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="Profile"
            className="rounded-full w-24 h-24"
          />
        )}
        <h2 className="text-page-title text-on-surface">{name}</h2>
        {title && (
          <p className="text-body-lg text-on-surface-secondary">{title}</p>
        )}
        {location && (
          <p className="text-body-lg text-on-surface-secondary">{location}</p>
        )}
        {website && (
          <a href={website} className="text-body-lg text-on-surface-secondary">
            Website
          </a>
        )}
        {linkedin && (
          <a href={linkedin} className="text-body-lg text-on-surface-secondary">
            LinkedIn
          </a>
        )}
        {summary && (
          <p className="text-body-lg text-on-surface-secondary">{summary}</p>
        )}
      </div>
    </>
  );
};

export default SharedProfileView;
