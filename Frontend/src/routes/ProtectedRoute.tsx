import { Navigate, Outlet } from "react-router";

import LoadingState from "../components/shared/LoadingState";
import { useAuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
        return <LoadingState message="Loading your account" />;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;