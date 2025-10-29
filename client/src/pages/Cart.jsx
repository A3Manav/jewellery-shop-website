import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

// Cart Component with quantity controls
function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (id, change) => {
    const item = cart.find((item) => item._id === id);
    if (item) {
      const newQuantity = Math.max(1, Math.min(10, item.quantity + change));
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-thin text-gray-900 mb-4 tracking-wide">
            Shopping Cart
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-gray-600 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-8">
              Discover our exquisite collection of fine jewelry
            </p>
            <Link
              to="/store"
              className="inline-flex items-center px-8 py-4 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="group bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Clickable Image */}
                        <Link
                          to={`/product/${item._id}`}
                          className="w-full md:w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden cursor-pointer"
                        >
                          <img
                            src={item.images[0]?.url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </Link>

                        <div className="flex-1 space-y-4">
                          <div>
                            <Link
                              to={`/product/${item._id}`}
                              className="block hover:text-amber-600 transition-colors duration-200"
                            >
                              <h3 className="text-xl font-light text-gray-900 mb-2 cursor-pointer">
                                {item.title}
                              </h3>
                            </Link>
                            <p className="text-2xl font-thin text-gray-900">
                              ₹{item.price.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-500 font-medium">
                                Quantity:
                              </span>
                              <div className="flex items-center border border-gray-200 rounded-lg">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(item._id, -1);
                                  }}
                                  disabled={item.quantity <= 1}
                                  className={`p-2 transition-colors duration-200 cursor-pointer ${
                                    item.quantity <= 1
                                      ? "text-gray-300 cursor-not-allowed"
                                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M20 12H4"
                                    />
                                  </svg>
                                </button>
                                <span className="px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(item._id, 1);
                                  }}
                                  disabled={item.quantity >= 10}
                                  className={`p-2 transition-colors duration-200 cursor-pointer ${
                                    item.quantity >= 10
                                      ? "text-gray-300 cursor-not-allowed"
                                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                </button>
                              </div>
                              {item.quantity >= 10 && (
                                <span className="text-xs text-amber-600 font-medium">
                                  Max limit reached
                                </span>
                              )}
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(item._id);
                              }}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>

                          <div className="pt-4 border-t border-gray-100">
                            <p className="text-lg font-light text-gray-900">
                              Subtotal: ₹
                              {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-100 p-8 sticky top-24">
                <h3 className="text-2xl font-light text-gray-900 mb-8">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-light text-gray-900">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full bg-gray-900 text-white py-4 px-8 text-center font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 mb-4 block"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/"
                  className="w-full border border-gray-300 text-gray-900 py-4 px-8 text-center font-medium hover:border-gray-400 transition-colors duration-300 block"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
