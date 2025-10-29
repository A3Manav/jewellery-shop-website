import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function VerifyEmail() {
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // 'verifying', 'success', 'error', 'expired'
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      verifyEmail(token);
    } else {
      setVerificationStatus("error");
    }
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const response = await axios.get(`/api/auth/verify-email?token=${token}`);
      setVerificationStatus("success");
      toast.success("Email verified successfully! You can now log in.");
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Verification failed";
      if (errorMsg.includes("expired") || errorMsg.includes("invalid")) {
        setVerificationStatus("expired");
      } else {
        setVerificationStatus("error");
      }
      toast.error(errorMsg);
    }
  };

  const handleResendVerification = async () => {
    // This would require the user's email, which we don't have in this component
    // In a real app, you'd want to store the email in localStorage or pass it via URL
    toast.error(
      "Please log in and request a new verification email from your profile."
    );
    navigate("/login");
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <>
            <div className="flex justify-center mb-4">
              <img
                src="https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png"
                alt="Abhushan Kala Kendra Logo"
                className="h-16 w-16 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
              />
            </div>
            <h2 className="text-4xl font-thin text-gray-900 mb-4">
              Verifying Your Email
            </h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600 font-light">
              Please wait while we verify your email address...
            </p>
          </>
        );

      case "success":
        return (
          <>
            <div className="flex justify-center mb-4">
              <img
                src="https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png"
                alt="Abhushan Kala Kendra Logo"
                className="h-16 w-16 rounded-full object-cover border-2 border-green-400 shadow-lg"
              />
            </div>
            <h2 className="text-4xl font-thin text-gray-900 mb-4">
              Email Verified!
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-green-800">
                Success!
              </h3>
              <p className="mt-2 text-sm text-green-700">
                Your email has been successfully verified. You can now log in to
                your account.
              </p>
            </div>
            <Link
              to="/login"
              className="w-full bg-gray-900 text-white py-4 px-8 font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 inline-block text-center"
            >
              Continue to Login
            </Link>
          </>
        );

      case "expired":
        return (
          <>
            <div className="flex justify-center mb-4">
              <img
                src="https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png"
                alt="Abhushan Kala Kendra Logo"
                className="h-16 w-16 rounded-full object-cover border-2 border-red-400 shadow-lg"
              />
            </div>
            <h2 className="text-4xl font-thin text-gray-900 mb-4">
              Verification Link Expired
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <svg
                className="mx-auto h-12 w-12 text-red-400"
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
              <h3 className="mt-4 text-lg font-medium text-red-800">
                Link Expired
              </h3>
              <p className="mt-2 text-sm text-red-700">
                This verification link has expired. Please request a new
                verification email.
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                className="w-full bg-gray-900 text-white py-4 px-8 font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
              >
                Request New Verification
              </button>
              <Link
                to="/login"
                className="w-full bg-gray-100 text-gray-700 py-4 px-8 font-medium hover:bg-gray-200 transition-all duration-300 inline-block text-center"
              >
                Back to Login
              </Link>
            </div>
          </>
        );

      case "error":
      default:
        return (
          <>
            <div className="flex justify-center mb-4">
              <img
                src="https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png"
                alt="Abhushan Kala Kendra Logo"
                className="h-16 w-16 rounded-full object-cover border-2 border-red-400 shadow-lg"
              />
            </div>
            <h2 className="text-4xl font-thin text-gray-900 mb-4">
              Verification Failed
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <svg
                className="mx-auto h-12 w-12 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-red-800">
                Invalid Link
              </h3>
              <p className="mt-2 text-sm text-red-700">
                This verification link is invalid or has already been used.
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                className="w-full bg-gray-900 text-white py-4 px-8 font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
              >
                Request New Verification
              </button>
              <Link
                to="/login"
                className="w-full bg-gray-100 text-gray-700 py-4 px-8 font-medium hover:bg-gray-200 transition-all duration-300 inline-block text-center"
              >
                Back to Login
              </Link>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-md w-full space-y-8 text-center">
        {renderContent()}
      </div>
    </div>
  );
}

export default VerifyEmail;
