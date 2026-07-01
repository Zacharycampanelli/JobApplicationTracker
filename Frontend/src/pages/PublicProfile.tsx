import SharedProfileView from "../features/profile/components/SharedProfileView";
import { useParams } from "react-router";
import { getPublicProfile } from "../features/profile/profileApi";
import { useEffect, useState } from "react";
import { useBreakpoint } from "../utils/useBreakpoint";

const PublicProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState(true);
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;

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

  const loadData = async () => {
    if (!id) return;
    const profileId = Number(id);
    try {
      const data = await getPublicProfile(profileId);

      setEmpty(false);
      setError("");
      setProfile({
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (empty) return <p>No profile found</p>;

  return (
    <SharedProfileView
      name={profile.name}
      avatarUrl={profile.avatarUrl}
      title={profile.title}
      location={profile.location}
      website={profile.website}
      linkedin={profile.linkedin}
      summary={profile.summary}
    />
  );
};

export default PublicProfile;
