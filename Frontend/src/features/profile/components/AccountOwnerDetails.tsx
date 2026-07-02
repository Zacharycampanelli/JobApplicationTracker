import Account from "../../../assets/images/account.svg?react";

type AccountOwnerDetailsProps = {
  email: string;
  createdAt: string;
  updatedAt: string;
};

const AccountOwnerDetails = ({
  email,
  createdAt,
  updatedAt
}: AccountOwnerDetailsProps) => {
  const dateFormat = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  return (
    <div className="flex flex-col py-4 gap-4 mb-4">
      <span className="flex text-on-surface-variant text-status items-center text-start gap-4 text-card-title px-8">
        <Account />
        <h3 className="text-card-title text-on-surface-variant">
          Account Details:
        </h3>
      </span>

      <dl className="flex flex-col gap-4 md:grid grid-cols-2">
        <div className="flex flex-col">
          <dt className="text-label-md text-on-surface mb-2">EMAIL ADDRESS</dt>
          <dd className="w-full bg-surface-container-low text-on-surface outline-none px-3 h-10 rounded-control text-body-md flex items-center">
            {email}
          </dd>
        </div>
        <div>
          <dt className="text-label-md text-on-surface mb-2">CREATED AT</dt>
          <dd className="w-full bg-surface-container-low text-on-surface outline-none px-3 h-10 rounded-control text-body-md flex items-center">
            {dateFormat(createdAt)}
          </dd>
        </div>
        <div>
          <dt className="text-label-md text-on-surface mb-2">UPDATED AT</dt>
          <dd className="w-full bg-surface-container-low text-on-surface outline-none px-3 h-10 rounded-control text-body-md flex items-center">
            {dateFormat(updatedAt)}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default AccountOwnerDetails;
