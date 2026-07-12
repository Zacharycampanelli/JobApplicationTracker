import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../context/AuthContext";
import LoadingState from "../components/shared/LoadingState";

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