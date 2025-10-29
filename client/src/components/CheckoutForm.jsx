import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import { INDIAN_STATES } from "../constants/indianStates";
import SavedAddresses from "./SavedAddresses";
import toast from "react-hot-toast";
import {
  CreditCard,
  MapPin,
  Phone,
  User,
  Lock,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

function CheckoutForm({ onOrderStart }) {
  const { cart, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    paymentMode: "COD",
  });

  const handleAddressSelect = (address) => {
    setSelectedSavedAddress(address);
    // Pre-fill form data from selected address
    if (address) {
      setFormData((prev) => ({
        ...prev,
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        street: address.street,
        apartment: address.apartment || "",
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      }));
      // Clear any errors when address is selected
      setErrors({});
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.street.trim())
      newErrors.street = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "PIN code is required";

    // Format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    const pincodeRegex = /^\d{6}$/;
    if (formData.pincode && !pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit PIN code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsLoading(true);

    // Notify parent component that order process has started
    if (onOrderStart) {
      onOrderStart();
    }

    try {
      const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const shipping = subtotal > 5000 ? 0 : 100;
      const tax = Math.round(subtotal * 0.18);
      const totalAmount = subtotal + shipping + tax;

      const orderData = {
        products: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price, // Include price at time of order
        })),
        totalAmount,
        paymentMode: formData.paymentMode,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        address: {
          street:
            formData.street +
            (formData.apartment ? `, ${formData.apartment}` : ""),
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
        },
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        },
      };

      if (formData.paymentMode === "Razorpay") {
        const { data } = await axios.post("/api/orders", orderData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.razorpayOrder.amount,
          currency: "INR",
          name: "Abhushan Kala Kendra",
          description: "Premium Jewelry Purchase",
          order_id: data.razorpayOrder.id,
          handler: async (response) => {
            setIsLoading(false);
            toast.success("Payment successful! Order placed.");
            cart.forEach((item) => removeFromCart(item._id));
            navigate("/profile");
          },
          modal: {
            ondismiss: () => {
              setIsLoading(false);
              toast.error("Payment cancelled");
            },
          },
          theme: {
            color: "#1f2937",
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        await axios.post("/api/orders", orderData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setIsLoading(false);
        toast.success("Order placed successfully!");
        cart.forEach((item) => removeFromCart(item._id));
        navigate("/profile");
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Order placement error:", err);
      toast.error(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Saved Addresses */}
      <div className="space-y-6">
        <SavedAddresses onSelectAddress={handleAddressSelect} />
      </div>

      {/* Contact Information - Only show when no saved address selected */}
      {!selectedSavedAddress && (
        <div className="space-y-6 border-t pt-8">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                  errors.firstName ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.firstName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                  errors.lastName ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                  errors.phone ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shipping Address - Only show when no saved address selected */}
      {!selectedSavedAddress && (
        <div className="space-y-6 border-t pt-8">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Shipping Address
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                errors.street ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter street address"
            />
            {errors.street && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.street}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apartment, suite, etc. (Optional)
            </label>
            <input
              type="text"
              name="apartment"
              value={formData.apartment}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
              placeholder="Apartment, suite, building, floor, etc."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                  errors.city ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.city}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                  errors.state ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.state}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN Code *
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                  errors.pincode ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter PIN code"
                maxLength="6"
              />
              {errors.pincode && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.pincode}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="space-y-6 border-t pt-8">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Method
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.paymentMode === "COD"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMode"
                value="COD"
                checked={formData.paymentMode === "COD"}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    formData.paymentMode === "COD"
                      ? "border-gray-900"
                      : "border-gray-300"
                  }`}
                >
                  {formData.paymentMode === "COD" && (
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Cash on Delivery
                  </div>
                  <div className="text-sm text-gray-500">
                    Pay when you receive
                  </div>
                </div>
              </div>
            </label>
            <label
              className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.paymentMode === "Razorpay"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMode"
                value="Razorpay"
                checked={formData.paymentMode === "Razorpay"}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    formData.paymentMode === "Razorpay"
                      ? "border-gray-900"
                      : "border-gray-300"
                  }`}
                >
                  {formData.paymentMode === "Razorpay" && (
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Online Payment
                  </div>
                  <div className="text-sm text-gray-500">
                    Credit/Debit Card, UPI, Net Banking
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="border-t pt-8">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-900 hover:bg-gray-800 shadow-lg hover:shadow-xl"
          } text-white`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Lock className="w-5 h-5" />
          )}
          {isLoading ? "Processing..." : "Complete Order"}
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Your payment information is secure and encrypted
        </p>
      </div>
    </form>
  );
}

export default CheckoutForm;
