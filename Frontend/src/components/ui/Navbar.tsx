import { NavLink } from "react-router";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/applications", label: "Applications" },
  { to: "/analytics", label: "Analytics" },
  { to: "/profile", label: "Profile" },
];

const baseLinkClasses =
  "flex items-center justify-center rounded-xl text-label-md transition-colors";

const Navbar = () => {
  return (
    <>
      {/* Mobile Bottom Navbar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-2 px-3 py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                [
                  baseLinkClasses,
                  "min-h-12 px-2 py-2",
                  isActive
                    ? "bg-primary text-white"
                    : "bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop / Tablet Side Navbar */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col md:bg-surface-container-low md:px-4 md:py-6 lg:w-72">
        <div className="mb-8 px-3">
          <h1 className="text-title-lg text-on-surface">Job Tracker</h1>
          <p className="mt-1 text-label-md text-on-surface-variant">
            Track your applications
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                [
                  "rounded-xl px-4 py-3 text-left text-label-md transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;