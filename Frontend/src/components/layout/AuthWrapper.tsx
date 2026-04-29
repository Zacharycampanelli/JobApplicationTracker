import { Outlet } from "react-router";

const AuthWrapper = () => {
  return (
    <div className="min-h-screen bg-surface">
      <main className="mx-auto flex flex-col min-h-screen w-full items-center justify-start px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthWrapper;