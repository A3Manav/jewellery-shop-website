import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  X,
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
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function OrderDetails({ orderId, onClose, onOrderCancelled }) {
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
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
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
      if (onOrderCancelled) onOrderCancelled();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.msg || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "processing":
        return <Package className="w-5 h-5" />;
      case "shipped":
        return <Truck className="w-5 h-5" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5" />;
      case "cancelled":
      case "canceled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const canCancelOrder =
    order &&
    (order.status?.toLowerCase() === "pending" ||
      order.status?.toLowerCase() === "processing");

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
          <div className="flex items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-center text-gray-600 mt-4">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-4 max-h-[95vh] overflow-y-auto">
        {/* Mobile-First Header */}
        <div className="sticky top-0 bg-black text-white px-4 py-4 flex items-center justify-between rounded-t-xl z-10">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-amber-500/20 rounded-full border border-amber-400/30 mb-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span className="text-amber-400 text-xs font-medium tracking-wide uppercase">
                Order Details
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-light text-white truncate">
              <span className="bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
                Order #{order.orderId}
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Mobile-First Order Status */}
          <div className="bg-gradient-to-r from-gray-50 to-amber-50/30 rounded-xl p-4 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 md:p-3 rounded-lg ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                    {getStatusText(order.status)}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {canCancelOrder && (
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm w-full sm:w-auto"
                >
                  {isCancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
          </div>

          {/* Mobile-First Products Section */}
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
              Order Items
            </h3>
            <div className="space-y-3">
              {order.products?.map((item, index) => (
                <Link
                  key={index}
                  to={`/product/${item.product?._id}`}
                  onClick={onClose}
                  className="flex gap-3 bg-white rounded-lg p-3 border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  {/* Mobile-Optimized Image */}
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product?.images?.[0]?.url ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.target.src = "/assets/images/chudi.jpeg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm md:text-base truncate group-hover:text-amber-600 transition-colors duration-200">
                      {item.product?.title || "Product"}
                    </h4>
                    <div className="mt-1 space-y-1">
                      <p className="text-xs md:text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 truncate">
                        {item.product?.category || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900 text-sm md:text-base">
                      ₹{(item.product?.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">
                      ₹{item.product?.price?.toLocaleString()} each
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile-First Delivery Address */}
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
              Delivery Address
            </h3>
            <div className="bg-gradient-to-r from-gray-50 to-amber-50/30 rounded-lg p-4 border border-gray-200">
              {order.customerInfo && (
                <div className="mb-3">
                  <p className="font-medium text-gray-900 text-sm md:text-base">
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="truncate">{order.customerInfo.email}</span>
                  </p>
                </div>
              )}
              <div className="text-xs md:text-sm text-gray-700 space-y-1">
                <p>{order.address?.street}</p>
                <p>
                  {order.address?.city}, {order.address?.state} -{" "}
                  {order.address?.pincode}
                </p>
                {order.address?.phone && (
                  <p className="flex items-center gap-1 mt-2">
                    <Phone className="w-3 h-3 md:w-4 md:h-4" />
                    {order.address.phone}
                  </p>
                )}
              </div>
              {/* Debug: Check the actual status */}
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <div>
                  Debug: Status = "{order.status}" | Lowercase = "
                  {order.status?.toLowerCase()}"
                </div>
                <div className="mt-1">
                  Full Order Keys: {Object.keys(order).join(", ")}
                </div>
                <div className="mt-1">
                  Order Object: {JSON.stringify(order, null, 2).slice(0, 500)}
                  ...
                </div>
              </div>
              {/* Show "address cannot be changed" message for processing/shipped/delivered orders only */}
              {(order.status?.toLowerCase() === "processing" ||
                order.status?.toLowerCase() === "shipped" ||
                order.status?.toLowerCase() === "delivered") && (
                <div className="mt-3 p-2 md:p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs md:text-sm text-blue-800 flex items-center gap-2">
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Address cannot be changed after order is processed
                    </span>
                  </p>
                </div>
              )}
              {/* Show cancellation message for cancelled orders */}
              {(order.status?.toLowerCase() === "cancelled" ||
                order.status?.toLowerCase() === "canceled") && (
                <div className="mt-3 p-2 md:p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-xs md:text-sm text-red-800 flex items-center gap-2">
                    <XCircle className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span>
                      This order has been cancelled and will not be processed
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile-First Payment & Price Summary */}
          <div className="space-y-4 md:space-y-6">
            {/* Payment Method */}
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                Payment Method
              </h3>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="font-medium text-gray-900 text-sm md:text-base">
                  {order.paymentMode}
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  {order.paymentMode === "COD"
                    ? "Pay when you receive"
                    : "Online Payment"}
                </p>
              </div>
            </div>

            {/* Price Summary */}
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                Price Summary
              </h3>
              <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-lg p-4 border border-amber-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-sm md:text-base">
                    Total Amount
                  </span>
                  <span className="font-bold text-gray-900 text-lg md:text-xl">
                    ₹{order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-First Footer */}
        <div className="sticky bottom-0 bg-white px-4 py-4 border-t border-gray-200 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm md:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
