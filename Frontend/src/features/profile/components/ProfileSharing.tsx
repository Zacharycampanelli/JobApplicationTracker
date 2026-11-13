import { useAuthContext } from "../../../context/AuthContext";

const ProfileSharing = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  const isPublic = user.preferences?.publicProfileEnabled ?? false;
  const profileUrl = `${window.location.origin}/profiles/${user.id}`;

  return (
    <section className="rounded-card bg-surface-container p-6">
      <h2 className="text-card-title text-on-surface">Share your profile</h2>

      <p className="mt-2 text-body-md text-on-surface-secondary">
        {isPublic
          ? "Your public profile is available to anyone with the link."
          : "Enable Public profile in Account Preferences to share your profile."}
      </p>

      {isPublic && (
        <p className="mt-4 break-all text-body-md text-on-surface">
          {profileUrl}
        </p>
      )}
    </section>
  );
};

export default ProfileSharing;