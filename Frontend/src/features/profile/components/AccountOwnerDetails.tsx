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
  return (
    <div className="flex flex-col py-4">
      <span className="flex text-on-surface-variant text-status items-center text-start gap-4 text-card-title px-8">
        <Account  />
        <h3 className="text-card-title text-on-surface-variant">
          Account Details:
        </h3>
      </span>
      <div className="px-12">
        
      <p className="text-label-md text-on-surface">Email: {email}</p>
      <p className="text-label-md text-on-surface">Created At: {createdAt}</p>
      <p className="text-label-md text-on-surface">Updated At: {updatedAt}</p>
      </div>
    </div>
  );
};

export default AccountOwnerDetails;
