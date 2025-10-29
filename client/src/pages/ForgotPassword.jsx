import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      setEmailSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      const errorMsg =
        error.response?.data?.msg || "Failed to send reset email";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png"
              alt="Abhushan Kala Kendra Logo"
              className="h-16 w-16 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
            />
          </div>
          <h2 className="text-4xl font-thin text-gray-900 mb-4">
            {emailSent ? "Check Your Email" : "Forgot Password"}
          </h2>
          <p className="text-gray-600 font-light">
            {emailSent
              ? "We've sent you a password reset link. Please check your email."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mt-6"></div>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="mt-12 space-y-6">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-200 focus:border-gray-400 focus:outline-none transition-colors duration-200 bg-white text-gray-900 font-light"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-4 px-8 font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="mt-12 space-y-6">
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <svg
                  className="mx-auto h-12 w-12 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-green-800">
                  Email Sent!
                </h3>
                <p className="mt-2 text-sm text-green-700">
                  If an account with that email exists, we've sent you a
                  password reset link.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEmailSent(false);
                setEmail("");
              }}
              className="w-full bg-gray-100 text-gray-700 py-4 px-8 font-medium hover:bg-gray-200 transition-all duration-300"
            >
              Send Another Email
            </button>
          </div>
        )}

        <div className="text-center">
          <p className="text-gray-600 font-light">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-gray-900 hover:underline font-medium"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
