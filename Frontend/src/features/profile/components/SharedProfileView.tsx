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
    <div className="mt-4 flex flex-col gap-8">
      {!avatarUrl && (
        <span className="flex justify-center items-center size-28 mx-auto my-8 rounded-full bg-surface-container-high text-page-title text-on-surface">
          {name?.charAt(0).toUpperCase() ?? "U"}
        </span>
      )}
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={`${name} avatar`}
          className="size-28 mx-auto my-8 rounded-full object-cover"
        />
      )}

      <dl className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <dt className="text-label-md text-on-surface">FULL NAME</dt>
          <dd className="flex min-h-10 w-full items-center rounded-control bg-surface-container-low px-3 text-body-md text-on-surface">
            {name}
          </dd>
        </div>
        {title && (
          <div className="flex flex-col gap-2">
            <dt className="text-label-md text-on-surface">TITLE</dt>
            <dd className="flex min-h-10 w-full items-center rounded-control bg-surface-container-low px-3 text-body-md text-on-surface">
              {title}
            </dd>
          </div>
        )}
        {location && (
          <div className="flex flex-col gap-2">
            <dt className="text-label-md text-on-surface">LOCATION</dt>
            <dd className="flex min-h-10 w-full items-center rounded-control bg-surface-container-low px-3 text-body-md text-on-surface">
              {location}
            </dd>
          </div>
        )}
        {website && (
          <div className="flex flex-col gap-2">
            <dt className="text-label-md text-on-surface">WEBSITE</dt>
            <dd className="flex min-h-10 w-full items-center rounded-control bg-surface-container-low px-3 text-body-md text-on-surface">
              <a href={website} className="break-all text-on-surface hover:underline">
                {website}
              </a>
            </dd>
          </div>
        )}
        {linkedin && (
          <div className="flex flex-col gap-2">
            <dt className="text-label-md text-on-surface">LINKEDIN</dt>
            <dd className="flex min-h-10 w-full items-center rounded-control bg-surface-container-low px-3 text-body-md text-on-surface">
              <a href={linkedin} className="break-all text-on-surface hover:underline">
                {linkedin}
              </a>
            </dd>
          </div>
        )}
        {summary && (
          <div className="flex flex-col gap-2">
            <dt className="text-label-md text-on-surface">SUMMARY</dt>
            <dd className="min-h-28 w-full whitespace-pre-wrap rounded-control bg-surface-container-low px-3 py-2 text-body-md text-on-surface">
              {summary}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
};

export default SharedProfileView;
