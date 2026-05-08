import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;