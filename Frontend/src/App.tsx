import { BrowserRouter, Route, Routes } from "react-router";
import AppWrapper from "./components/layout/AppWrapper";
import AuthWrapper from "./components/layout/AuthWrapper";

import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import AddApplication from "./pages/AddApplication";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import EditApplication from "./pages/EditApplication";
import PublicProfile from "./pages/PublicProfile";
import NotFound from "./pages/NotFound";
import Test from "./pages/Test";
import AuthPage from "./pages/AuthPage";
import GuestRoute from "./routes/GuestRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Main app routes with navbar */}
            <Route  element={<AppWrapper />}>
              {/* Public routes */}
              <Route path="/profiles/:id" element={<PublicProfile />} />

              {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/applications">
                <Route index element={<Applications />} />
                <Route path="add" element={<AddApplication />} />
                <Route path="edit/:id" element={<EditApplication />} />
              </Route>
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
          {/* Auth routes without navbar */}
          <Route element={<AuthWrapper />}>
            <Route element={<GuestRoute />} >
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/register" element={<AuthPage mode="signup" />} />
            </Route>
            <Route path="/forgot-password" element={<AuthPage mode="forgot-password" />} />
            <Route path="/reset-password" element={<AuthPage mode="reset-password" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
