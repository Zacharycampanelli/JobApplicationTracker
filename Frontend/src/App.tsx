import { BrowserRouter, Route, Routes } from "react-router";
import AppWrapper from "./components/layout/AppWrapper";
import AuthWrapper from "./components/layout/AuthWrapper";

import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main app routes with navbar */}
        <Route element={<AppWrapper />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Auth routes without navbar */}
        <Route element={<AuthWrapper />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
