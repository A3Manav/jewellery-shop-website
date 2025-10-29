import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-lg opacity-30"></div>
            <img
              src="https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png"
              alt="Abhushan Kala Kendra Logo"
              className="relative h-20 w-20 rounded-full object-cover border-4 border-amber-200 shadow-xl"
            />
          </div>
        </div>
        <h1 className="text-8xl font-extrabold text-amber-500 tracking-tighter">
          404
        </h1>
        <p className="text-2xl md:text-3xl font-light text-gray-800 mt-4">
          Page Not Found
        </p>
        <p className="text-gray-600 font-light mt-4 max-w-md mx-auto">
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </p>
        <div className="w-20 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto mt-8"></div>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3 px-8 font-medium hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Go Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
