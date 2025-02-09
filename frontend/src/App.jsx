import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import SignupPage from "./pages/SignupPage";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === "/signup" ||
      location.pathname === "/login" ||
      location.pathname === "/settings"
    )
      return;
    else checkAuth();
  }, [checkAuth, location.pathname]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <>
      <div>
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />} // If user is authenticated, it can access home page, else redirect to login page
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to="/" />} // If user already authenticated, redirect to home page
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />} // If user already authenticated, redirect to home page
          />
          <Route
            path="/settings"
            element={<SettingsPage />} // Settings page is accessible to all users
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />} // If user is authenticated, it can access profile page, else redirect to login page
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
