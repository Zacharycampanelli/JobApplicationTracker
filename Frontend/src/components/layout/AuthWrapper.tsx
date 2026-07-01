import { Outlet } from "react-router";

const AuthWrapper = () => {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-surface">
      <Outlet />
    </div>
  );
};

export default AuthWrapper;
