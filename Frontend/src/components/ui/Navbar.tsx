import { NavLink } from "react-router";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/applications", label: "Applications" },
  { to: "/analytics", label: "Analytics" },
  { to: "/profile", label: "Profile" }
];

const baseLinkClasses =
  "flex items-center justify-center rounded-md text-sm font-medium transition-colors";

const Navbar = () => {
  return (
    <>
      {/* Mobile Bottom Navbar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-0 bg-white/80 backdrop-blur-xl md:hidden">
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
                    ? "bg-slate-900 text-white"
                    : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop/Tablet Side Navbar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 md:bg-slate-100/80 md:px-4 md:py-6 lg:w-72">
        <div className="mb-8 px-3">
          <h1 className="text-xl font-semibold text-slate-900">Job Tracker</h1>
          <p className="mt-1 text-sm text-slate-500">Track your applications</p>
        </div>

        <nav className="flex flex-col gap2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                [
                  "rounded-md px-4 py-3 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
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
