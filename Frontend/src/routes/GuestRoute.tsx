import { Navigate, Outlet } from "react-router";

import LoadingState from "../components/shared/LoadingState";
import { useAuthContext } from "../context/AuthContext";

const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingState message="Loading your account" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;