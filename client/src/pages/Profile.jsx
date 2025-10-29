import { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import ProductCard from "../components/ProductCard";
import { INDIAN_STATES } from "../constants/indianStates";
import toast from "react-hot-toast";
import {
  Heart,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Eye,
  Truck,
  Calendar,
} from "lucide-react";

function Profile() {
  const {
    user,
    isLoading: authLoading,
    wishlistProducts,
    fetchWishlistProducts,
  } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    phone: user?.address?.phone || "",
  });

  // Helper function to get user-friendly status text
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Order Placed Successfully";
      case "processing":
        return "Preparing Your Order";
      case "shipped":
        return "Order Shipped";
      case "delivered":
        return "Order Delivered";
      case "cancelled":
      case "canceled":
        return "Order Cancelled";
      default:
        return status || "Unknown Status";
    }
  };

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      axios
        .get("/api/orders", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => res.data),
    enabled: !!user && !!localStorage.getItem("token"),
  });

  const handleViewOrderDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  // Refresh wishlist when component mounts or user changes
  useEffect(() => {
    if (user?.wishlist && fetchWishlistProducts) {
      fetchWishlistProducts(user.wishlist);
    }
  }, [user?.wishlist]); // Removed fetchWishlistProducts from dependencies

  // Handle authentication redirects
  useEffect(() => {
    if (!user && !authLoading) {
      navigate("/login", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "/api/auth/profile",
        {
          ...formData,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            phone: formData.phone,
          },
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          timeout: 10000, // 10 second timeout
        }
      );
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  // Show loading state while authentication is loading or user is not loaded
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-black text-white pt-20 pb-6">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-600 rounded w-32 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-600 rounded w-24 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div
              className="flex items-center justify-center"
              style={{ minHeight: "300px" }}
            >
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Mobile-First Header */}
      <div className="bg-black text-white pt-20 pb-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-400/30">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                <span className="text-amber-400 text-xs font-medium tracking-wide uppercase">
                  My Account
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-black" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl md:text-3xl font-light text-white mb-1">
                  <span className="bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
                    {user.name || "User"}
                  </span>
                </h1>
                <p className="text-gray-300 text-sm">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Mobile-First Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {[
                {
                  id: "profile",
                  name: "Profile",
                  icon: User,
                  shortName: "Profile",
                },
                {
                  id: "wishlist",
                  name: "Wishlist",
                  icon: Heart,
                  shortName: "Wishlist",
                  count: wishlistProducts?.length,
                },
                {
                  id: "orders",
                  name: "Orders",
                  icon: Package,
                  shortName: "Orders",
                  count: orders?.length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-all flex-shrink-0 min-w-[100px] ${
                    activeTab === tab.id
                      ? "border-amber-400 text-amber-600 bg-white -mb-px"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.shortName}</span>
                  {tab.count !== undefined && (
                    <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded-full text-xs font-medium">
                      {tab.count || 0}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 md:p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                </div>
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2 text-amber-500" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2 text-amber-500" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-amber-50/30 rounded-lg p-4 md:p-6 border border-gray-200">
                    <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-amber-500" />
                      Address Information
                    </h4>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={formData.street}
                          onChange={(e) =>
                            setFormData({ ...formData, street: e.target.value })
                          }
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <select
                          value={formData.state}
                          onChange={(e) =>
                            setFormData({ ...formData, state: e.target.value })
                          }
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Pincode"
                          value={formData.pincode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pincode: e.target.value,
                            })
                          }
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Heart className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    My Wishlist
                  </h3>
                </div>
                {!wishlistProducts || wishlistProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-amber-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-500 mb-2">
                      Your wishlist is empty
                    </h4>
                    <p className="text-gray-400 mb-6 text-sm">
                      Start adding products you love to see them here
                    </p>
                    <a
                      href="/"
                      className="inline-flex items-center px-6 py-3 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors font-medium"
                    >
                      Browse Products
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {wishlistProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        fromProfile={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Package className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order History
                  </h3>
                </div>
                {ordersLoading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-amber-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-500 mb-2">
                      No orders yet
                    </h4>
                    <p className="text-gray-400 mb-6 text-sm">
                      When you place orders, they'll appear here
                    </p>
                    <a
                      href="/"
                      className="inline-flex items-center px-6 py-3 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors font-medium"
                    >
                      Start Shopping
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((order) => (
                        <div
                          key={order._id}
                          className="bg-gradient-to-r from-gray-50 to-amber-50/30 border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Package className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">
                                  Order #{order.orderId}
                                </h4>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Truck className="w-3 h-3 md:w-4 md:h-4" />
                                  {order.paymentMode}
                                </span>
                              </div>
                            </div>
                            <div className="text-left sm:text-right flex-shrink-0">
                              <p className="font-semibold text-gray-900 text-lg md:text-xl">
                                ₹{order.totalAmount?.toLocaleString()}
                              </p>
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                  order.status === "delivered"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : order.status === "shipped"
                                    ? "bg-purple-100 text-purple-800"
                                    : order.status === "processing"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {getStatusText(order.status)}
                              </span>
                            </div>
                          </div>

                          {/* Mobile-Optimized Product Images Preview */}
                          {order.products && order.products.length > 0 && (
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                              <div className="flex -space-x-2">
                                {order.products.slice(0, 3).map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 border-white shadow-sm"
                                  >
                                    {item.product?.images?.[0]?.url ? (
                                      <img
                                        src={item.product.images[0].url}
                                        alt={item.product.title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <Package className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                ))}
                                {order.products.length > 3 && (
                                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-amber-100 border-2 border-white shadow-sm flex items-center justify-center">
                                    <span className="text-amber-600 text-xs font-medium">
                                      +{order.products.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <span className="text-xs md:text-sm text-gray-600">
                                {order.products.length}{" "}
                                {order.products.length === 1 ? "item" : "items"}
                              </span>
                            </div>
                          )}

                          <button
                            onClick={() => handleViewOrderDetails(order._id)}
                            className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View Order Details
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
