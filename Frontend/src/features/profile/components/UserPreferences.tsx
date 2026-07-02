import Toggle from "../../../components/ui/Toggle";
import UserPreferenceItem from "./UserPreferenceItem";
import ProfileNav from "../../../assets/images/profileNav.svg?react";
import Edit from "../../../assets/images/edit.svg?react";
import Sun from "../../../assets/images/sun.svg?react";
import Lock from "../../../assets/images/lock.svg?react";
import Warning from "../../../assets/images/warning.svg?react";
import ExpandableSection from "../../../components/shared/ExpandableSection";
import Settings from "../../../assets/images/settings.svg?react";
import { useAuthContext } from "../../../context/AuthContext";
import { updateUserPreferences } from "../profileApi";
import type {
  UpdatePreferencesValues
} from "../../../types/types";


const UserPreferences = () => {
  const { user, updateUser } = useAuthContext();


  const handlePreferenceChange = async (
    changes: Partial<UpdatePreferencesValues>
  ) => {
    if (!user) return;

    const currentPreferences: UpdatePreferencesValues = {
      publicProfileEnabled: user.preferences?.publicProfileEnabled ?? false,
      autoStatusUpdatesEnabled:
        user.preferences?.autoStatusUpdatesEnabled ?? false,
      themePreference: user.preferences?.themePreference ?? "system"
    };

    try {
      const updatedPreferences = await updateUserPreferences({
        ...currentPreferences,
        ...changes
      });

      updateUser({
        ...user,
        preferences: updatedPreferences
      });
    } catch (error) {
      console.error("Failed to update preferences", error);
    }
  };

  const preferenceOptions = [
    {
      preference: "Public profile",
      icon: ProfileNav,
      mode: "toggle",
      isDangerous: false,
      description: "",
      children: (
        <Toggle
          checked={user?.preferences?.publicProfileEnabled ?? false}
          onChange={(checked) =>
            handlePreferenceChange({
              publicProfileEnabled: checked
            })
          }
        />
      )
    },
    {
      preference: "Automatic status updates",
      icon: Edit,
      mode: "toggle",
      isDangerous: false,
      description: "",
      children: (
        <Toggle
          id="automaticStatusUpdates"
          checked={user?.preferences?.autoStatusUpdatesEnabled ?? false}
          onChange={(checked) =>
            handlePreferenceChange({
              autoStatusUpdatesEnabled: checked
            })
          }
        />
      )
    },
    {
      preference: "Dark mode",
      icon: Sun,
      mode: "toggle",
      isDangerous: false,
      description: "",
      children: (
        <Toggle
          id="darkMode"
          checked={user?.preferences?.themePreference === "dark"}
          onChange={(checked) =>
            handlePreferenceChange({
              themePreference: checked ? "dark" : "light"
            })
          }
        />
      )
    },
    {
      preference: "Password and MFA",
      icon: Lock,
      mode: "dropdown",
      isDangerous: false,
      description: "",
      children: <ExpandableSection title="">hi</ExpandableSection>
    },
    {
      preference: "Deactivate account",
      icon: Warning,
      mode: "dropdown",
      isDangerous: true,
      description: "",
      children: <ExpandableSection title="">hi</ExpandableSection>
    }
  ];

  return (
    <div className="flex flex-col gap-4 w-full mt-8 rounded-xl overflow-hidden">
      <span className="flex text-on-surface-variant text-status items-center text-start gap-4 text-card-title px-8">
        <Settings fill="#66757d" />
        <h3 className="">Account Preferences</h3>
      </span>
      <div className="flex flex-col gap-4 md:grid grid-cols-2">
      {preferenceOptions.map((option) => (
        <UserPreferenceItem
          key={option.preference}
          preference={option.preference}
          icon={option.icon}
          mode={option.mode as "toggle" | "dropdown" | undefined}
          isDangerous={option.isDangerous}
          children={option.children}
        />
      ))}
      </div>
    </div>
  );
};

export default UserPreferences;
