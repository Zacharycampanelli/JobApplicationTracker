import { useEffect, useState } from "react";
import { useParams } from "react-router";

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
    email: "",
    name: "",
    avatarUrl: "",
    title: "",
    location: "",
    website: "",
    linkedin: "",
    summary: ""
  });

  const loadData = async () => {
    if (!id) return;
    const profileId = Number(id);
    try {
      const data = await getPublicProfile(profileId);

      setEmpty(false);
      setError("");
      setProfile({
        email: data.email ?? "",
        name: data.name ?? "",
        avatarUrl: data.profile?.avatarUrl ?? "",
        title: data.profile?.title ?? "",
        location: data.profile?.location ?? "",
        website: data.profile?.website ?? "",
        linkedin: data.profile?.linkedin ?? "",
        summary: data.profile?.summary ?? ""
      });
    } catch (err) {
      setError(`Failed to load profile: ${err}`);
      setEmpty(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    console.log(profile);
  }, [profile]);

  if (isLoading) return <LoadingState message="Loading profile..." />;
  if (error) return <ErrorState message={error} />
  if (empty) return <EmptyState title="No profile found" description="The requested profile could not be found." />

  return (
    <>
      <Header />
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface md:px-6 py-4 md:relative">
        <SharedProfileView
          email={profile.email}
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
