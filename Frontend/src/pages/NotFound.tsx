import { useNavigate } from "react-router";
import Warning from "../assets/images/warning.svg?react";
import Button from "../components/ui/Button";
import { useAuthContext } from "../context/AuthContext";
const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4 mt-8 text-center md:relative">
      <Warning className="w-32 h-32 mx-auto" />
      <p className="text-page-title text-on-surface">Page not found</p>

      <p className="text-body-md text-on-surface mt-6">
        The page you're looking for doesn't exist, or you may not have
        permission to view it.
      </p>
<div className="flex w-3/4 md:w-1/2 mx-auto justify-around flex-col md:flex-row">
      {isAuthenticated ? (
        <>
          <Button className="w-full mt-6 md:w-48" onClick={() => navigate("/")}>
            Go To Dashboard
          </Button>
          <Button
            className="w-full mt-6 md:w-48"
            variant="secondary"
            onClick={() => navigate("/applications")}
          >
            Applications
          </Button>
        </>
      ) : (
        <>
          <Button className="w-full mt-6 md:w-48" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button className="w-full mt-6 md:w-48" variant="secondary" onClick={() => navigate("/register")}>
            Register
          </Button>
        </>
      )}
      </div>
    </div>
  );
};

export default NotFound;
