import { useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Package,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  Truck,
  ShoppingBag,
  Search,
  Filter,
  Calendar,
  MoreVertical,
  Eye,
  Edit,
} from "lucide-react";

function AdminManageOrders() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      axios
        .get("/api/orders/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => res.data),
    enabled: !!user,
  });

  const updateOrderStatus = useMutation({
    mutationFn: ({ id, status }) =>
      axios.put(
        `/api/orders/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update order status"),
  });

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Order Placed";
      case "processing":
        return "Preparing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  const filteredOrders =
    orders?.filter((order) => {
      const matchesSearch =
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-4">
            <p className="text-red-600">
              Error loading orders: {error.message}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              #{order.orderId}
            </h3>
            <p className="text-xs text-gray-600">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {getStatusIcon(order.status)}
          {getStatusLabel(order.status)}
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-3">
        <div className="flex items-center space-x-2 mb-1">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">
            {order.user ? order.user.name : "Guest"}
          </span>
        </div>
        {order.user?.email && (
          <p className="text-xs text-gray-600 ml-6">{order.user.email}</p>
        )}
      </div>

      {/* Order Value */}
      <div className="flex items-center space-x-2 mb-3">
        <DollarSign className="w-4 h-4 text-green-600" />
        <span className="text-lg font-bold text-green-600">
          ₹{order.totalAmount?.toLocaleString()}
        </span>
      </div>

      {/* Products */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Products</h4>
        <div className="space-y-1">
          {order.products?.slice(0, 2).map((item, index) => (
            <div
              key={`${item.product?._id || index}-${index}`}
              className="flex justify-between text-xs"
            >
              <span className="text-gray-600 truncate flex-1">
                {item.product ? item.product.title : "Unknown Product"}
              </span>
              <span className="text-gray-900 font-medium ml-2">
                Qty: {item.quantity}
              </span>
            </div>
          ))}
          {order.products?.length > 2 && (
            <p className="text-xs text-gray-500">
              +{order.products.length - 2} more items
            </p>
          )}
        </div>
      </div>

      {/* Status Update */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Update Status
        </label>
        <select
          value={order.status}
          onChange={(e) =>
            updateOrderStatus.mutate({
              id: order._id,
              status: e.target.value,
            })
          }
          disabled={updateOrderStatus.isPending}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm disabled:opacity-50"
        >
          <option value="pending">Order Placed Successfully</option>
          <option value="processing">Preparing Order</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => navigate(`/order/${order._id}`)}
          className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-lg">
        <div className="px-4 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="p-2 rounded-full bg-black bg-opacity-20 backdrop-blur-sm text-white hover:bg-opacity-30 transition-all duration-300 active:scale-95 shadow-lg border border-white border-opacity-30"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                <ShoppingBag className="w-6 h-6 mr-2" />
                Manage Orders
              </h1>
              <p className="text-amber-100 text-sm">
                {filteredOrders.length} of {orders?.length || 0} orders
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by order ID, customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Order Placed</option>
              <option value="processing">Preparing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Statistics */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["pending", "processing", "shipped", "delivered"].map((status) => (
            <div
              key={status}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center"
            >
              <div
                className={`inline-flex items-center gap-1 mb-1 ${getStatusColor(
                  status
                )} px-2 py-1 rounded-full text-xs font-medium`}
              >
                {getStatusIcon(status)}
                {getStatusLabel(status)}
              </div>
              <p className="text-lg font-bold text-gray-900">
                {orders?.filter((o) => o.status === status).length || 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 pb-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter
                ? "Try adjusting your search or filter criteria."
                : "Orders will appear here when customers make purchases."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminManageOrders;
