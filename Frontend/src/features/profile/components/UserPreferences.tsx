import { useState } from "react";
import Toggle from "../../../components/ui/Toggle";
import UserPreferenceItem from "./UserPreferenceItem";
import ProfileNav from "../../../assets/images/profileNav.svg?react";
import Edit from "../../../assets/images/edit.svg?react";
import Sun from "../../../assets/images/sun.svg?react";
import Lock from "../../../assets/images/lock.svg?react";
import Warning from "../../../assets/images/warning.svg?react";
import ExpandableSection from "../../../components/shared/ExpandableSection";
import Settings from "../../../assets/images/settings.svg?react";
type PreferenceState = {
  publicProfileEnabled: boolean;
  automaticStatusUpdates: boolean;
  darkMode: boolean;
  passwordAndMFAEnabled: boolean;
  deactivateAccountEnabled: boolean;
};

const UserPreferences = () => {
  const [userPreferences, setUserPreferences] = useState<PreferenceState>({
    publicProfileEnabled: false,
    automaticStatusUpdates: false,
    darkMode: false,
    passwordAndMFAEnabled: false,
    deactivateAccountEnabled: false
  });

  const preferenceOptions = [
    {
      preference: "Public profile",
      icon: ProfileNav,
      mode: "toggle",
      isDangerous: false,
      description: "",
      children: (
        <Toggle
          id="publicProfile"
          checked={userPreferences.publicProfileEnabled}
          onChange={() =>
            setUserPreferences({
              ...userPreferences,
              publicProfileEnabled: !userPreferences.publicProfileEnabled
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
          checked={userPreferences.automaticStatusUpdates}
          onChange={() =>
            setUserPreferences({
              ...userPreferences,
              automaticStatusUpdates: !userPreferences.automaticStatusUpdates
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
          checked={userPreferences.darkMode}
          onChange={() =>
            setUserPreferences({
              ...userPreferences,
              darkMode: !userPreferences.darkMode
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
      <span className="flex text-on-surface-variant text-status items-center text-start gap-4">
        <Settings fill="#66757d" />
        <h3>Account Preferences</h3>
      </span>
      {preferenceOptions.map((option) => (
        <UserPreferenceItem
          key={option.preference}
          preference={option.preference}
          icon={option.icon}
          mode={option.mode}
          isDangerous={option.isDangerous}
          children={option.children}
        />
      ))}
    </div>
  );
};

export default UserPreferences;
