import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthImagePattern from "../../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const SignupPage = () => {
  const navigate = useNavigate();
  const { isSigningUp, signup } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const signupRes = await signup(formData);
    if (signupRes === true) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT (TOP FOR MOBILE) SECTION */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="fieldset">
              <label className="label">Full Name</label>
              <label className="input validator w-full">
                <User className="size-5 text-base-content/40" />
                <input
                  type="input"
                  required
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </label>
              <p className="validator-hint hidden">Full name is required</p>
            </div>

            <div className="fieldset">
              <label className="label">Email</label>
              <label className="input validator w-full">
                <Mail className="size-5 text-base-content/40" />
                <input
                  type="email"
                  placeholder="Enter your email "
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </label>
              <div className="validator-hint hidden">
                Enter valid email address
              </div>
            </div>

            <div className="fieldset">
              <label className="label">Password</label>
              <label className="input validator w-full">
                <Lock className="size-5 text-base-content/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  minLength="6"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </label>
              <p className="validator-hint hidden">
                Password must be at least 6 characters
              </p>
            </div>

            <button
              className="btn btn-primary w-full"
              type="submit"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT (BOTTOM FOR MOBILE) SECTION */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignupPage;
