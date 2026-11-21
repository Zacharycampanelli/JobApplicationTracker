import { toast } from "sonner";

import EmailIcon from "../../../assets/images/email.svg?react";
import LinkedinIcon from "../../../assets/images/linkedin.svg?react";
import XIcon from "../../../assets/images/x.svg?react";
import Button from "../../../components/ui/Button";
import { useAuthContext } from "../../../context/AuthContext";

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

  const shareText = `View my professional profile - ${user.name}`;
  const emailBody = `${shareText}\n\n${profileUrl}`;

  const shareLinks = [
    {
      label: "LinkedIn",
      icon: <LinkedinIcon className="size-5 shrink-0" aria-hidden="true" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`
    },
    {
      label: "X",
      icon: <XIcon className="size-5 shrink-0" aria-hidden="true" />,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`
    },
    {
      label: "Email",
      icon: <EmailIcon className="size-5 shrink-0 [&_path]:fill-current" aria-hidden="true" />,
      href: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(emailBody)}`
    }
  ];

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
        <div className="mt-5 flex flex-col gap-4">
          <div className="rounded-control bg-surface-container-lowest p-4">
            <p className="mb-2 text-label-md text-on-surface-secondary">
              YOUR PROFILE LINK
            </p>
            <p className="break-all text-body-md text-on-surface">
              {profileUrl}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="primary"
              onClick={handleCopyLink}
              className="w-full sm:w-auto"
            >
              Copy link
            </Button>

            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-control px-3 py-2 text-center text-action text-link underline focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              View public profile
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <div className="border-t border-outline-variant pt-4">
            <p className="mb-2 text-label-md text-on-surface-secondary">
              SHARE VIA
            </p>

            <div className="flex flex-wrap gap-3">
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  className="inline-flex items-center justify-center rounded-control px-3 py-2 text-action text-link underline focus-visible:outline-2 focus-visible:outline-offset-4"
                  href={link.href}
                  target={link.label === "Email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={`Share via ${link.label}${
                    link.label === "Email"
                      ? " (opens your email app)"
                      : " (opens in a new tab)"
                  }`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfileSharing;
