import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import SEOMetaTags from "../components/SEO/SEOMetaTags";
import { generateLocalBusinessSchema } from "../components/SEO/StructuredData";
import { SEO_TEMPLATES } from "../components/SEO/seoConfig";
import {
  Heart,
  Star,
  Calendar,
  MessageCircle,
  Phone,
  MapPin,
  User,
  Package,
  Plus,
  Minus,
  Trash2,
  Send,
  Sparkles,
  Crown,
  Gift,
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  Scale,
  Gem,
  Mail,
  ChevronRight,
  Info,
  Clock,
  IndianRupee,
  Shirt,
  Coffee,
} from "lucide-react";

function MarriageBooking() {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  // Helper function to format address object to string
  const formatAddressToString = (addressObj) => {
    if (!addressObj || typeof addressObj === "string") {
      return addressObj || "";
    }

    const parts = [];
    if (addressObj.street) parts.push(addressObj.street);
    if (addressObj.city) parts.push(addressObj.city);
    if (addressObj.state) parts.push(addressObj.state);
    if (addressObj.pincode) parts.push(addressObj.pincode);

    return parts.join(", ");
  };

  const [formData, setFormData] = useState({
    productType: "",
    eventDate: "",
    message: "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: formatAddressToString(user?.address),
    budgetRange: "",
    numberOfItems: "",
    customDesignRequest: false,
    preferredContactMethod: "phone",
  });

  const productTypes = {
    "Wedding Jewelry": {
      name: "Hallmarked Wedding Jewelry",
      icon: Crown,
      description:
        "Complete bridal sets, gold necklaces, rings, bangles - all hallmarked",
    },
    "Marriage Pot Sets": {
      name: "Marriage Pot Sets (Vivah Kalash)",
      icon: Package,
      description: "Traditional wedding pot sets with complete accessories",
    },
    "Silver Collections": {
      name: "Silver Collections",
      icon: Gem,
      description:
        "Hallmarked silver jewelry, pens, plates & traditional items",
    },
    "Personalized Gifts": {
      name: "Personalized Gifts",
      icon: Gift,
      description:
        "Customized jewelry boxes, cups, bracelets, plates & printed gifts",
    },
    "Bulk Wedding Orders": {
      name: "Bulk Wedding Orders",
      icon: Star,
      description: "Complete wedding collections with scheduled delivery",
    },
    "Custom Design Consultation": {
      name: "Custom Design Consultation",
      icon: Coffee,
      description: "Design consultation for personalized jewelry & gift items",
    },
  };

  // Handle change for simple form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    // Handle checkbox inputs
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.productType.trim()) {
      newErrors.productType = "Please select a product type";
    }

    if (!formData.eventDate) {
      newErrors.eventDate = "Event date is required";
    } else {
      const eventDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        newErrors.eventDate = "Event date must be in the future";
      }
    }

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrors((prev) => ({
        ...prev,
        form: "Please fill in all required fields correctly",
      }));
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const bookingData = {
        ...formData,
        userId: user?._id,
      };

      const response = await axios.post("/api/marriage-bookings", bookingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(
        "🎉 Wedding booking submitted successfully! We will contact you within 24 hours."
      );

      // Reset form
      setFormData({
        productType: "",
        eventDate: "",
        message: "",
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: formatAddressToString(user?.address),
        budgetRange: "",
        numberOfItems: "",
        customDesignRequest: false,
        preferredContactMethod: "phone",
      });
      setCurrentStep(1);
      setErrors({});
    } catch (err) {
      console.error("Booking submission error:", err);
      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Failed to submit booking. Please try again.";
      setErrors((prev) => ({ ...prev, form: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <SEOMetaTags
        title={SEO_TEMPLATES.marriageBooking.title}
        description={SEO_TEMPLATES.marriageBooking.description}
        keywords={SEO_TEMPLATES.marriageBooking.keywords}
        canonicalUrl="https://abhushankalakendra.vercel.app/marriage-booking"
        structuredData={generateLocalBusinessSchema()}
        ogImage="https://abhushankalakendra.vercel.app/assets/images/marriage-booking-og.jpg"
      />
      {/* Hero Section */}
      <div className="relative bg-black min-h-[70vh] md:min-h-[90vh]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/assets/images/marriage-booking-img.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        ></div>
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Wedding Booking</span>
          </nav>

          {/* Hero Content */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Crown className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-light text-white">
                Premium Wedding Collections
              </h1>
              <Crown className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
            </div>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Hallmarked jewelry & personalized gifts for your special day
            </p>

            {/* Compact Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <Gem className="w-5 h-5 text-amber-400" />
                <span className="text-white text-sm font-medium">
                  Hallmarked Quality
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span className="text-white text-sm font-medium">
                  Custom Designs
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="text-white text-sm font-medium">
                  Bulk Orders
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
              {/* Progress Steps */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between">
                  {[
                    { number: 1, title: "Product Selection", icon: Package },
                    {
                      number: 2,
                      title: "Details & Requirements",
                      icon: MessageCircle,
                    },
                    { number: 3, title: "Contact Information", icon: User },
                  ].map((step, index) => (
                    <div key={step.number} className="flex items-center">
                      <div
                        className={`flex items-center gap-2 md:gap-3 ${
                          currentStep >= step.number
                            ? "text-black"
                            : "text-gray-400"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${
                            currentStep >= step.number
                              ? "bg-black text-white"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {currentStep > step.number ? (
                            <Check className="w-4 h-4 md:w-5 md:h-5" />
                          ) : (
                            <step.icon className="w-4 h-4 md:w-5 md:h-5" />
                          )}
                        </div>
                        <span className="font-medium text-xs md:text-sm hidden sm:block">
                          {step.title}
                        </span>
                      </div>
                      {index < 2 && (
                        <div
                          className={`h-px flex-1 mx-2 md:mx-4 ${
                            currentStep > step.number
                              ? "bg-black"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Product Selection */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-black mb-4">
                        Select Your Wedding Collection
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {Object.values(productTypes).map((type) => (
                          <div
                            key={type.name}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setFormData((prev) => ({
                                ...prev,
                                productType: type.name,
                              }));
                              // Clear any form errors when product is selected
                              if (errors.form) {
                                setErrors((prev) => ({ ...prev, form: null }));
                              }
                              // Automatically advance to next step after selection
                              setTimeout(() => {
                                setCurrentStep(2);
                              }, 300); // Small delay for smooth transition
                            }}
                            className={`p-4 md:p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                              formData.productType === type.name
                                ? "border-black bg-gray-50 shadow-md"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start gap-3 md:gap-4">
                              <div
                                className={`p-2 md:p-3 rounded-lg ${
                                  formData.productType === type.name
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                <type.icon className="w-5 h-5 md:w-6 md:h-6" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-black mb-1 md:mb-2 text-sm md:text-base">
                                  {type.name}
                                </h4>
                                <p className="text-xs md:text-sm text-gray-600">
                                  {type.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Budget Range */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3">
                        Budget Range (Optional)
                      </label>
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        className="w-full p-3 md:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
                      >
                        <option value="">Select Budget Range</option>
                        <option value="under-50k">Under ₹50,000</option>
                        <option value="50k-1l">₹50,000 - ₹1,00,000</option>
                        <option value="1l-2l">₹1,00,000 - ₹2,00,000</option>
                        <option value="2l-5l">₹2,00,000 - ₹5,00,000</option>
                        <option value="above-5l">Above ₹5,00,000</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 2: Event & Requirements */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg md:text-xl font-semibold text-black mb-4">
                      Event Details & Requirements
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* Event Date */}
                      <div>
                        <label
                          htmlFor="eventDate"
                          className="block text-sm font-semibold text-black mb-3"
                        >
                          Event Date *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 md:left-4 top-3 md:top-4 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            id="eventDate"
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                            required
                            className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
                          />
                        </div>
                        {errors.eventDate && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.eventDate}
                          </p>
                        )}
                      </div>

                      {/* Number of Items */}
                      <div>
                        <label
                          htmlFor="numberOfItems"
                          className="block text-sm font-semibold text-black mb-3"
                        >
                          Approximate Number of Items
                        </label>
                        <select
                          name="numberOfItems"
                          value={formData.numberOfItems}
                          onChange={handleChange}
                          className="w-full p-3 md:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
                        >
                          <option value="">Select Range</option>
                          <option value="1-5">1-5 items</option>
                          <option value="6-10">6-10 items</option>
                          <option value="11-20">11-20 items</option>
                          <option value="20+">More than 20 items</option>
                        </select>
                      </div>
                    </div>

                    {/* Special Requirements */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-black mb-3"
                      >
                        Special Requirements & Preferences
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Please describe your specific requirements, design preferences, cultural traditions, color schemes, or any special requests..."
                        className="w-full p-3 md:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors resize-none"
                      />
                    </div>

                    {/* Custom Design Request */}
                    <div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="customDesignRequest"
                          checked={formData.customDesignRequest}
                          onChange={handleChange}
                          className="w-5 h-5 text-black border-gray-300 rounded focus:ring-2 focus:ring-amber-400"
                        />
                        <span className="text-sm font-medium text-black">
                          I'm interested in custom design consultation
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Information */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg md:text-xl font-semibold text-black mb-4">
                      Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold text-black mb-3"
                        >
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 md:left-4 top-3 md:top-4 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
                            placeholder="Enter your full name"
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-semibold text-black mb-3"
                        >
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 md:left-4 top-3 md:top-4 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
                            placeholder="Enter your phone number"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-black mb-3"
                        >
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 md:left-4 top-3 md:top-4 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
                            placeholder="Enter your email address"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Preferred Contact Method */}
                      <div>
                        <label className="block text-sm font-semibold text-black mb-3">
                          Preferred Contact Method
                        </label>
                        <select
                          name="preferredContactMethod"
                          value={formData.preferredContactMethod}
                          onChange={handleChange}
                          className="w-full p-3 md:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
                        >
                          <option value="phone">Phone Call</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="email">Email</option>
                        </select>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-semibold text-black mb-3"
                      >
                        Address (Optional)
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-3 md:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors resize-none"
                        placeholder="Enter your complete address for delivery/pickup coordination"
                      />
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {errors.form && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {errors.form}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentStep((prev) => Math.max(1, prev - 1));
                    }}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                      currentStep === 1
                        ? "text-gray-400 cursor-not-allowed opacity-50"
                        : "text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl"
                    }`}
                  >
                    {currentStep > 1 && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    )}
                    {currentStep === 2 ? "Change Selection" : "Previous"}
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        // Validate current step before proceeding
                        if (currentStep === 1 && !formData.productType) {
                          setErrors((prev) => ({
                            ...prev,
                            form: "Please select a product type",
                          }));
                          return;
                        }
                        if (currentStep === 2 && !formData.eventDate) {
                          setErrors((prev) => ({
                            ...prev,
                            eventDate: "Event date is required",
                          }));
                          return;
                        }
                        setErrors({});
                        setCurrentStep((prev) => prev + 1);
                      }}
                      className="px-6 md:px-8 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 md:px-8 py-3 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Booking Request
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 sticky top-8">
              <h3 className="font-semibold text-black mb-6">Booking Summary</h3>

              <div className="space-y-3 md:space-y-4">
                {formData.productType && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    {productTypes[formData.productType] &&
                      (() => {
                        const IconComponent =
                          productTypes[formData.productType].icon;
                        return (
                          <IconComponent className="w-5 h-5 text-gray-600" />
                        );
                      })()}
                    <span className="text-sm font-medium text-black">
                      {formData.productType}
                    </span>
                  </div>
                )}

                {formData.eventDate && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-black">
                      {new Date(formData.eventDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                )}

                {formData.budgetRange && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <IndianRupee className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-black">
                      {formData.budgetRange === "under-50k" && "Under ₹50,000"}
                      {formData.budgetRange === "50k-1l" &&
                        "₹50,000 - ₹1,00,000"}
                      {formData.budgetRange === "1l-2l" &&
                        "₹1,00,000 - ₹2,00,000"}
                      {formData.budgetRange === "2l-5l" &&
                        "₹2,00,000 - ₹5,00,000"}
                      {formData.budgetRange === "above-5l" && "Above ₹5,00,000"}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 md:mt-8 p-4 md:p-6 bg-white rounded-xl border border-gray-200">
                <div className="flex items-start gap-3 mb-4">
                  <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-black mb-1">
                      What's Next?
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      After submitting, our wedding specialist will contact you
                      within 24 hours to discuss your requirements.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 p-4 md:p-6 bg-black rounded-xl text-white">
                <h4 className="font-semibold mb-4 text-amber-400">
                  Need Immediate Assistance?
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 flex-shrink-0 text-amber-400" />
                    <a
                      href="tel:+917295810660"
                      className="text-sm hover:text-amber-400 transition-colors"
                    >
                      +91-7295810660
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 flex-shrink-0 text-amber-400" />
                    <a
                      href="mailto:abhushankalakendra@gmail.com"
                      className="text-sm hover:text-amber-400 transition-colors"
                    >
                      abhushankalakendra@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 flex-shrink-0 text-amber-400" />
                    <span className="text-sm">Mon-Sat: 10 AM - 8 PM</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                    <div className="text-sm leading-relaxed">
                      <div className="font-medium mb-1">
                        Abhushan Kala Kendra
                      </div>
                      <div>Samhauta Bazar, Bhabhata</div>
                      <div>Chanpatia, West Champaran</div>
                      <div>Bihar – 845449</div>
                    </div>
                  </div>

                  {/* Brand Attribution */}
                  <div className="mt-4 pt-4 border-t border-amber-400/20">
                    <a
                      href="https://www.kalawatiputra.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-300 hover:text-amber-100 transition-colors duration-200"
                    >
                      A brand of Kalawatiputra.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarriageBooking;
