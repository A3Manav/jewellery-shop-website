import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.includes("@") || !formData.email.includes("."))
      newErrors.email = "Please include a valid email";
    if (formData.password.length < 6)
      newErrors.password = "Password must be 6 or more characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password
      );
      if (result?.success) {
        navigate(result.redirectTo, { replace: true });
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errorData = err.response.data;
        if (errorData.errors) {
          // Handle validation errors from express-validator
          const errorMap = {};
          errorData.errors.forEach((err) => {
            errorMap[err.param] = err.msg;
          });
          setErrors(errorMap);
          toast.error("Please fix the form errors");
        } else if (errorData.msg === "User already exists") {
          setErrors({ email: "This email is already registered" });
          toast.error("This email is already registered");
        } else {
          toast.error("Registration failed");
        }
      } else {
        console.error("Registration error:", err);
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
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
            Create Account
          </h2>
          <p className="text-gray-600 font-light text-sm">
            Join our exclusive jewelry collection
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
                    "Google OAuth is not configured. Please use email registration."
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
                  Or create account with email
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all duration-200 bg-white text-gray-900 font-light placeholder-gray-400 ${
                  errors.name
                    ? "border-red-300 focus:border-red-400"
                    : "border-gray-200 focus:border-amber-400"
                }`}
                required
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

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
                className={`w-full px-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all duration-200 bg-white text-gray-900 font-light placeholder-gray-400 ${
                  errors.email
                    ? "border-red-300 focus:border-red-400"
                    : "border-gray-200 focus:border-amber-400"
                }`}
                required
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
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
                placeholder="Create a password (6+ characters)"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`w-full px-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all duration-200 bg-white text-gray-900 font-light placeholder-gray-400 ${
                  errors.password
                    ? "border-red-300 focus:border-red-400"
                    : "border-gray-200 focus:border-amber-400"
                }`}
                required
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3.5 px-6 font-medium hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </div>

        <div className="text-center pt-2">
          <p className="text-gray-600 font-light text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-600 hover:text-amber-700 hover:underline font-medium transition-colors duration-200"
            >
              Sign in
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

export default Register;
