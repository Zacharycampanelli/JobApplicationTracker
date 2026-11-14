import { toast } from "sonner";

import { useAuthContext } from "../../../context/AuthContext";
import Button from "../../../components/ui/Button";

const ProfileSharing = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  const isPublic = user.preferences?.publicProfileEnabled ?? false;
  const profileUrl = `${window.location.origin}/profiles/${user.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied!");
    } catch {
      toast.error("Unable to copy. Please copy the displayed link manually.");
    }
  };

  //   const handleShareVia = (method: "email" | "twitter" | "linkedin") => {
  //     const subject = `Check out my profile - ${user.name || "Job Tracker User"}`;
  //     const body = `Hi! I wanted to share my professional profile with you. You can view it here:\n\n${profileUrl}`;

  //     switch (method) {
  //         case "email":
  //             window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  //             break;
  //         case "twitter":
  //             window.open(
  //                 `https://twitter.com/intent/tweet?text=${encodeURIComponent(subject)}&url=${encodeURIComponent(profileUrl)}`,
  //                 "_blank"
  //             );
  //             break;
  //         case "linkedin":
  //             window.open(
  //                 `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(profileUrl)}&title=${encodeURIComponent(subject)}&summary=${encodeURIComponent(body)}`,
  //                 "_blank"
  //             );
  //             break;
  //     }
  //     toast.success(`Sharing via ${method.toUpperCase()}...`);
  //   };

  return (
    <section className="rounded-card bg-surface-container p-6">
      <h2 className="text-card-title text-on-surface">Share your profile</h2>

      <p className="mt-2 text-body-md text-on-surface-secondary">
        {isPublic
          ? "Your public profile is available to anyone with the link."
          : "Enable Public profile in Account Preferences to share your profile."}
      </p>

      <p className="mt-2 text-body-md text-on-surface-secondary">
        When enabled, your name, photo, title, location, summary, website, and
        LinkedIn link are public. Your account email, applications, and résumé
        library are not included.
      </p>

      {isPublic && (
        <div className="mt-4 flex flex-col gap-4">
          <p className="break-all text-body-md text-on-surface">{profileUrl}</p>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded-control text-action text-link underline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            View Public Profile
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCopyLink}
            className="w-fit"
          >
            Copy link
          </Button>
        </div>
      )}
    </section>
  );
};

export default ProfileSharing;
