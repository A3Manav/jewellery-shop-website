import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { CartContext } from "../contexts/CartContext";
import {
  Menu,
  X,
  ShoppingBag,
  User,
  Crown,
  Sparkles,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";

// Navbar Component
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const cartCount = cart.length;
  const navRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
      }
    }

    if (isMenuOpen || isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isProfileOpen]);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 w-full bg-white/95 backdrop-blur-xl z-99 border-b border-gray-100 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Section - Enhanced */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <img
                src="https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png"
                alt="Abhushan Kala Kendra Logo"
                className="relative h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-amber-200 group-hover:border-amber-300 transition-all duration-300"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg md:text-xl font-light text-gray-900 tracking-wide group-hover:text-amber-600 transition-colors duration-300">
                ABHUSHAN KALA
              </span>
              <div className="flex items-center">
                <span className="text-xs text-amber-600 font-medium tracking-wider group-hover:text-amber-700 transition-colors duration-300">
                  KENDRA
                </span>
              </div>
            </div>
          </Link>

          {/* Mobile Cart & Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Mobile Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
              onClick={(e) => {
                // Prevent any event propagation that might affect menu state
                e.stopPropagation();
                // Close the mobile menu when cart is clicked
                setIsMenuOpen(false);
              }}
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation - Enhanced */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-all duration-200 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/store"
              className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-all duration-200 relative group"
            >
              Store
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/categories"
              className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-all duration-200 relative group"
            >
              Explore Categories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/marriage-booking"
              className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-all duration-200 relative group"
            >
              Marriage Jewellery Booking
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Desktop Cart */}
            <Link
              to="/cart"
              className="relative p-3 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 mx-2"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Section - Enhanced */}
            {user ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">
                    {user.name?.split(" ")[0] || "User"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
                    >
                      <Settings className="w-4 h-4" />
                      Profile Settings
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
                      >
                        <Crown className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        const result = logout();
                        if (result?.success) {
                          navigate(result.redirectTo, { replace: true });
                        }
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Enhanced */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 animate-fade-in-down">
          <div className="px-5 pt-5 pb-6 space-y-1">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-gray-800 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/store"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-gray-800 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-colors"
            >
              Store
            </Link>
            <Link
              to="/categories"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-gray-800 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-colors"
            >
              Explore Categories
            </Link>
            <Link
              to="/marriage-booking"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-gray-800 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-colors"
            >
              Marriage Jewellery Booking
            </Link>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>

            {/* User Section - Mobile */}
            {user ? (
              <>
                <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-all duration-200"
                >
                  <Settings className="w-5 h-5" />
                  Profile Settings
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-all duration-200"
                  >
                    <Crown className="w-5 h-5" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    const result = logout();
                    if (result?.success) {
                      navigate(result.redirectTo, { replace: true });
                    }
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-yellow-600 transition-all duration-200 shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
