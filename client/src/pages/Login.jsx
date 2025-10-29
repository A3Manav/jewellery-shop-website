import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function Login() {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log("✅ User already logged in, redirecting...");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setRequiresVerification(false);
    try {
      const result = await login(formData.email, formData.password);
      if (result?.success) {
        navigate(result.redirectTo, { replace: true });
      }
    } catch (err) {
      if (err.response?.data?.requiresVerification) {
        setRequiresVerification(true);
      } else {
        toast.error("Invalid credentials");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      toast.error("Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur opacity-20"></div>
              <img
                src="https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png"
                alt="Abhushan Kala Kendra Logo"
                className="relative h-14 w-14 rounded-full object-cover border-2 border-amber-200 shadow-lg"
              />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-2 tracking-wide">
            Welcome Back
          </h2>
          <p className="text-gray-600 font-light text-sm">
            Sign in to your account
          </p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto mt-4"></div>
        </div>

        <div className="mt-8 space-y-5">
          {/* Google OAuth Button */}
          <div className="space-y-4">
            <button
              onClick={() => {
                try {
                  const googleAuthUrl = `${
                    import.meta.env.VITE_API_URL
                  }/auth/google`;
                  window.location.href = googleAuthUrl;
                } catch (error) {
                  toast.error(
                    "Google OAuth is not configured. Please use email/password login."
                  );
                }
              }}
              className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 px-6 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-light">
                  Or continue with email
                </span>
              </div>
            </div>
          </div>

          {requiresVerification && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-amber-800">
                    Email Verification Required
                  </h3>
                  <p className="text-xs text-amber-700 mt-1">
                    Please verify your email address before logging in.
                  </p>
                  <button
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="mt-2 text-xs text-amber-800 hover:text-amber-900 font-medium underline disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend verification email"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all duration-200 bg-white text-gray-900 font-light placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all duration-200 bg-white text-gray-900 font-light placeholder-gray-400"
                required
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3.5 px-6 font-medium hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/forgot-password"
            className="text-gray-600 hover:text-amber-600 font-light hover:underline text-sm transition-colors duration-200"
          >
            Forgot your password?
          </Link>
        </div>

        <div className="text-center pt-2">
          <p className="text-gray-600 font-light text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-amber-600 hover:text-amber-700 hover:underline font-medium transition-colors duration-200"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Brand Attribution */}
        <div className="text-center pt-4 border-t border-gray-100 mt-6">
          <a
            href="https://www.kalawatiputra.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-amber-600 font-light text-xs transition-colors duration-200"
          >
            A brand of Kalawatiputra.com
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
