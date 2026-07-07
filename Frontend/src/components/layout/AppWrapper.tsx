import { Outlet } from "react-router";
import Navbar from "./Navbar";
import { useAuthContext } from "../../context/AuthContext";

const AppWrapper = () => {
  const { isAuthenticated } = useAuthContext();
  return (
    <div className="min-h-screen bg-surface md:flex">
      {isAuthenticated && <Navbar />}

      <main className="min-w-0 flex-1 pb-24 md:pb-0">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppWrapper;
