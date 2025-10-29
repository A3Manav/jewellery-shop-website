import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleGoogleAuthSuccess = async () => {
      const token = searchParams.get("token");

      if (!token) {
        toast.error("Authentication failed - no token received");
        navigate("/login", { replace: true });
        return;
      }

      try {
        // Store the token
        localStorage.setItem("token", token);

        // Navigate to home and let AuthContext initialize the user
        // The AuthContext useEffect will automatically detect the token and load user data
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Google auth success error:", error);

        // Clear invalid token
        localStorage.removeItem("token");

        toast.error("Authentication failed - please try again");
        navigate("/login", { replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    handleGoogleAuthSuccess();
  }, [navigate, searchParams]);

  if (!isProcessing) {
    return null; // Component will unmount after navigation
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center mb-4">
          <img
            src="https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png"
            alt="Abhushan Kala Kendra Logo"
            className="h-16 w-16 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
          />
        </div>
        <h2 className="text-2xl font-thin text-gray-900 mb-4">
          Signing you in...
        </h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-gray-600 font-light mt-4">
          Please wait while we complete your sign-in
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;
