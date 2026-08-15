import { Outlet } from "react-router";
import { Toaster } from "sonner";

import { useAuthContext } from "../../context/AuthContext";
import Navbar from "./Navbar";

const AppWrapper = () => {
  const { isAuthenticated } = useAuthContext();
  return (
    <div className="min-h-screen bg-surface md:flex">
      {isAuthenticated && <Navbar />}

      <main className="min-w-0 flex-1 pb-24 md:pb-0">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8">
          <Outlet />
        </div>
        <Toaster richColors/>
      </main>
    </div>
  );
};

export default AppWrapper;
