import { useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import CheckoutForm from "../components/CheckoutForm";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  CheckCircle,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";

function Checkout() {
  const { cart } = useContext(CartContext);
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const hasShownLoginToast = useRef(false);
  const hasShownCartToast = useRef(false);
  const isOrderInProgress = useRef(false);

  // Redirect if cart is empty or user not logged in
  useEffect(() => {
    // Don't redirect while authentication is still loading
    if (isLoading) return;

    // Don't redirect if order is in progress or cart was just emptied due to successful order
    if (isOrderInProgress.current) return;

    if (cart.length === 0 && !hasShownCartToast.current) {
      hasShownCartToast.current = true;
      toast.error(
        "Your cart is empty. Please add items to proceed with checkout."
      );
      navigate("/cart");
      return;
    }
    if (!user && !hasShownLoginToast.current) {
      hasShownLoginToast.current = true;
      toast.error("Please login to proceed with checkout");
      navigate("/login");
      return;
    }
  }, [cart, user, navigate, isLoading]);

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated or cart is empty
  if (!user || cart.length === 0) {
    return null;
  }

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 5000 ? 0 : 100; // Free shipping over ₹5000
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  const progressSteps = [
    { name: "Cart", icon: ShoppingBag, completed: true },
    { name: "Checkout", icon: CreditCard, completed: false, current: true },
    { name: "Confirmation", icon: CheckCircle, completed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Compact Header - Mobile First */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-6">
          {/* Mobile: Compact breadcrumb and back button */}
          <div className="flex items-center justify-between mb-3 md:mb-6">
            <div className="flex items-center gap-2">
              <Link
                to="/cart"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors text-sm md:text-base"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Back to Cart</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </div>

            {/* Compact breadcrumb - hidden on very small screens */}
            <nav className="hidden xs:flex items-center gap-1 text-xs md:text-sm text-gray-500">
              <Link to="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
              <span className="mx-1">/</span>
              <Link
                to="/cart"
                className="hover:text-gray-900 transition-colors"
              >
                Cart
              </Link>
              <span className="mx-1">/</span>
              <span className="text-gray-900 font-medium">Checkout</span>
            </nav>
          </div>

          {/* Title and Trust Badges - Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-xl md:text-3xl font-light text-gray-900">
              Secure Checkout
            </h1>

            {/* Trust Badges - Compact on mobile */}
            <div className="flex items-center justify-center sm:justify-end gap-3 md:gap-6 text-xs md:text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                <span className="hidden sm:inline">Secure Payment</span>
                <span className="sm:hidden">Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                <span className="hidden sm:inline">Free ₹5000+</span>
                <span className="sm:hidden">Free Ship</span>
              </div>
              <div className="flex items-center gap-1">
                <RotateCcw className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
                <span className="hidden sm:inline">Easy Returns</span>
                <span className="sm:hidden">Returns</span>
              </div>
            </div>
          </div>

          {/* Compact Progress Indicator */}
          <div className="mt-4 md:mt-8">
            <div className="flex items-center justify-center max-w-xs md:max-w-md mx-auto">
              {progressSteps.map((step, index) => (
                <div key={step.name} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${
                        step.completed
                          ? "bg-green-600 text-white"
                          : step.current
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <step.icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span
                      className={`text-xs mt-1 md:mt-2 font-medium ${
                        step.current ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div
                      className={`w-8 md:w-16 h-px mx-2 md:mx-4 ${
                        step.completed ? "bg-green-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
          {/* Checkout Form - Left Side */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 p-4 md:p-8">
              <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-6 md:mb-8">
                Shipping Information
              </h2>
              <CheckoutForm
                onOrderStart={() => {
                  isOrderInProgress.current = true;
                }}
              />
            </div>
          </div>

          {/* Order Summary - Right Side - Mobile Optimized */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 p-4 md:p-8 sticky top-20 md:top-24">
              <h3 className="text-lg md:text-xl font-light text-gray-900 mb-4 md:mb-6">
                Order Summary
              </h3>

              {/* Cart Items - Mobile Optimized */}
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.images?.[0]?.url || "/assets/images/chudi.jpeg"}
                      alt={item.title}
                      className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm md:text-base font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals - Mobile Optimized */}
              <div className="border-t border-gray-200 pt-4 md:pt-6 space-y-2 md:space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span
                    className={`${
                      shipping === 0 ? "text-green-600" : "text-gray-900"
                    }`}
                  >
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (GST 18%)</span>
                  <span className="text-gray-900">₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 md:pt-3">
                  <div className="flex justify-between">
                    <span className="text-base md:text-lg font-medium text-gray-900">
                      Total
                    </span>
                    <span className="text-lg md:text-xl font-semibold text-gray-900">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Info - Mobile Optimized */}
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                  <Shield className="w-3 h-3 md:w-4 md:h-4 text-green-600 flex-shrink-0" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
