import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { API_URL, ApiError } from "../api/api";
import Header from "../components/layout/Header";
import EmptyState from "../components/shared/EmptyState";
import ErrorState from "../components/shared/ErrorState";
import LoadingState from "../components/shared/LoadingState";
import SharedProfileView from "../features/profile/components/SharedProfileView";
import { getPublicProfile } from "../features/profile/profileApi";

const PublicProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState(true);

  const { id } = useParams();

  const [profile, setProfile] = useState({
    name: "",
    avatarUrl: "",
    title: "",
    location: "",
    website: "",
    linkedin: "",
    summary: ""
  });

  useEffect(() => {
    const loadData = async () => {
      const profileId = Number(id);
      setIsLoading(true);
      setError("");
      setEmpty(false);

      if (!Number.isInteger(profileId) || profileId <= 0) {
        setEmpty(true);
        setIsLoading(false);
        return;
      }

      try {
        const data = await getPublicProfile(profileId);

        setEmpty(false);
        setError("");
        setProfile({
          name: data.name ?? "",
          avatarUrl: data.profile?.avatarUrl
            ? `${API_URL}${data.profile.avatarUrl}`
            : "",
          title: data.profile?.title ?? "",
          location: data.profile?.location ?? "",
          website: data.profile?.website ?? "",
          linkedin: data.profile?.linkedin ?? "",
          summary: data.profile?.summary ?? ""
        });
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setEmpty(true);
        } else {
          setError("Unable to load this profile. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (isLoading) return <LoadingState message="Loading profile..." />;
  if (error) return <ErrorState message={error} />;
  if (empty)
    return (
      <EmptyState
        title="Profile unavailable"
        description="This profile doesn’t exist or isn’t currently shared."
        />
    );

  return (
    <>
      <Header />
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface md:px-6 py-4 md:relative">
        <SharedProfileView
          name={profile.name}
          avatarUrl={profile.avatarUrl}
          title={profile.title}
          location={profile.location}
          website={profile.website}
          linkedin={profile.linkedin}
          summary={profile.summary}
        />
      </div>
    </>
  );
};

export default PublicProfile;
