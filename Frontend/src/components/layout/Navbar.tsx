import { NavLink } from "react-router";

import AnalyticsNav from "../../assets/images/analyticsNav.svg?react";
import AppsNav from "../../assets/images/appsNav.svg?react";
import DashboardNav from "../../assets/images/dashboardNav.svg?react";
import Logout from "../../assets/images/logout.svg?react";
import ProfileNav from "../../assets/images/profileNav.svg?react";
import Icon from "../../assets/svg/Icon";
import { useAuthContext } from "../../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", mobileLabel: "Home", icon: DashboardNav },
  {
    to: "/applications",
    label: "Applications",
    mobileLabel: "Apps",
    icon: AppsNav
  },
  {
    to: "/analytics",
    label: "Analytics",
    mobileLabel: "Stats",
    icon: AnalyticsNav
  },
  { to: "/profile", label: "Profile", mobileLabel: "Profile", icon: ProfileNav }
];

const baseLinkClasses =
  "flex items-center justify-center rounded-card" +
  "text-nav-label uppercase" +
  "transition-colors duration-150" +
  "focus-visible:outline-2 focus-visible:outline-offset-2" +
  "focus-visible:outline-primary";

const desktopBaseLinkClasses =
  "flex items-center rounded-card px-4 py-3 text-left " +
  "text-nav-label uppercase " +
  "transition-colors duration-150 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-primary";

const Navbar = () => {
  const { logout } = useAuthContext();
  return (
    <>
      {/* Mobile Bottom Navbar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1 px-2 py-2">
          {navItems.map(({ to, mobileLabel, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                [
                  baseLinkClasses,
                  "min-h-12 px-1 py-1 gap-1 text-center flex flex-col rounded-card",
                  isActive
                    ? "bg-primary text-white focus-visible:outline-surface-bright"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface focus-visible:outline-primary"
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="max-w-full truncate">{mobileLabel}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop / Tablet Side Navbar */}
      <aside className="hidden md:flex md:w-56 md:shrink-0 md:flex-col md:bg-surface-container-low md:px-4 md:py-6 xl:w-72">
        <div className="mb-8 px-3">
          <div className="flex flex-row items-center">
            <Icon width={56} height={56} />
            <h1
              className="text-brand text-on-surface ml-2 "
              style={{ lineHeight: 1.0 }}
            >
              Architectural Ledger
            </h1>
          </div>
          <p className="mt-1 text-label-md mt-4 text-on-surface-variant">
            Track your applications
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                [
                  desktopBaseLinkClasses,
                  isActive
                    ? "bg-primary text-white focus-visible:outline-surface-bright"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface focus-visible:outline-primary"
                ].join(" ")
              }
            >
              <Icon className="mr-2 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={logout}
          className={[
            desktopBaseLinkClasses,
            "mt-auto w-full",
            "text-on-surface-variant",
            "hover:bg-surface-container-high hover:text-on-surface"
          ].join(" ")}
        >
          <Logout className="mr-2 h-5 w-5 shrink-0" aria-hidden="true" />
          Logout
        </button>
      </aside>
    </>
  );
};

export default Navbar;
