import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import SignupPage from "./pages/SignupPage";
import { useAuthStore } from "./store/useAuthStore";

const PrivateRoute = ({ children }) => {
  const { authUser } = useAuthStore();
  const isAuthenticated = !!authUser;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AuthRoute = ({ children }) => {
  const { authUser } = useAuthStore();
  const isAuthenticated = !!authUser;
  return isAuthenticated ? <Navigate to="/" /> : children;
};

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <SignupPage />
              </AuthRoute>
            }
          />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>

        <Toaster />
      </div>
    </>
  );
}

export default App;
