import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  User,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Order data received:", response.data);
      console.log("Shipping address:", response.data.shippingAddress);
      console.log("Legacy address:", response.data.address);
      console.log("Customer info:", response.data.customerInfo);
      console.log("User info:", response.data.user);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
      navigate("/profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setIsCancelling(true);
      await axios.put(
        `/api/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Order cancelled successfully");
      fetchOrderDetails(); // Refresh order details
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.msg || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      case "shipped":
        return <Truck className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div
            className="flex items-center justify-center"
            style={{ minHeight: "400px" }}
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Order not found
            </h3>
            <p className="text-gray-600 mb-6">
              The order you're looking for doesn't exist
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canCancelOrder =
    order.status === "pending" || order.status === "processing";

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button & Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to="/profile"
              className="hover:text-gray-900 transition-colors"
            >
              Profile
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Order Details</span>
          </nav>

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Profile</span>
          </button>
        </div>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-6 h-6 text-gray-600" />
                <h1 className="text-2xl font-semibold text-gray-900">
                  Order #{order.orderId}
                </h1>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusIcon(order.status)}
                {getStatusText(order.status)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.products?.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                      {item.product?.images?.[0]?.url ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {item.product?.title || "Product"}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Quantity: {item.quantity || 1}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">
                          ₹
                          {(
                            item.price ||
                            item.product?.price ||
                            0
                          ).toLocaleString()}{" "}
                          × {item.quantity || 1}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        ₹
                        {(
                          (item.price || item.product?.price || 0) *
                          (item.quantity || 1)
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Address
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {order.shippingAddress?.firstName ||
                    order.customerInfo?.firstName ||
                    order.user?.name?.split(" ")[0] ||
                    order.user?.name ||
                    "Customer"}{" "}
                  {order.shippingAddress?.lastName ||
                    order.customerInfo?.lastName ||
                    (order.user?.name?.split(" ").length > 1
                      ? order.user?.name?.split(" ").slice(1).join(" ")
                      : "")}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  {order.shippingAddress?.street ||
                    order.address?.street ||
                    "N/A"}
                  {(order.shippingAddress?.apartment ||
                    order.address?.apartment) &&
                    `, ${
                      order.shippingAddress?.apartment ||
                      order.address?.apartment
                    }`}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  {order.shippingAddress?.city || order.address?.city || "N/A"},{" "}
                  {order.shippingAddress?.state ||
                    order.address?.state ||
                    "N/A"}{" "}
                  -{" "}
                  {order.shippingAddress?.pincode ||
                    order.address?.pincode ||
                    "N/A"}
                </p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {order.shippingAddress?.phone ||
                      order.address?.phone ||
                      "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {order.shippingAddress?.email ||
                      order.customerInfo?.email ||
                      order.user?.email ||
                      "N/A"}
                  </p>
                </div>
              </div>
              {!canCancelOrder && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Delivery address cannot be changed after order is dispatched
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ₹{order.totalAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-gray-900 text-lg">
                      ₹{order.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">{order.paymentMode}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {order.paymentMode === "COD"
                    ? "Pay when you receive your order"
                    : "Payment completed"}
                </p>
              </div>
            </div>

            {/* Actions */}
            {canCancelOrder && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Actions
                </h2>
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isCancelling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      Cancel Order
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  You can cancel this order before it's dispatched
                </p>
              </div>
            )}

            {/* Support */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contact our support team for any assistance
              </p>
              <div className="space-y-2">
                <a
                  href="tel:+917295810660"
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <Phone className="w-4 h-4" />
                  +91-7295810660
                </a>
                <a
                  href="mailto:abhushankalakendra@gmail.com"
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <Mail className="w-4 h-4" />
                  abhushankalakendra@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
