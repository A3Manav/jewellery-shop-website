import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const AuthError = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error") || "Authentication failed";

    toast.error(error);
    navigate("/login", { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center mb-4">
          <img
            src="https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png"
            alt="Abhushan Kala Kendra Logo"
            className="h-16 w-16 rounded-full object-cover border-2 border-red-400 shadow-lg"
          />
        </div>
        <h2 className="text-2xl font-thin text-gray-900 mb-4">
          Authentication Error
        </h2>
        <div className="text-red-500 mb-4">
          <svg
            className="mx-auto h-12 w-12"
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
        </div>
        <p className="text-gray-600 font-light">
          Redirecting you back to login...
        </p>
      </div>
    </div>
  );
};

export default AuthError;
