import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Plus,
  Calendar,
  Settings,
  BarChart3,
  TrendingUp,
  Eye,
  Mail,
  BookOpen,
  Heart,
  Newspaper,
  ImageIcon,
  Phone,
  Edit,
  Activity,
  FolderPlus,
  Folder,
} from "lucide-react";
import axios from "axios";

const StatCard = ({ icon: Icon, title, value, color, trend }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10 flex-shrink-0`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
            {title}
          </p>
          <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            {value}
          </p>
        </div>
      </div>
      {trend && (
        <div className="flex items-center space-x-1 text-green-600 self-start sm:self-center">
          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{trend}</span>
        </div>
      )}
    </div>
  </div>
);

const QuickActionCard = ({
  icon: Icon,
  title,
  description,
  onClick,
  color,
}) => (
  <button
    onClick={onClick}
    className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 text-left hover:shadow-md transition-all hover:scale-[1.02] active:scale-95 w-full touch-manipulation"
  >
    <div className="flex items-start space-x-3">
      <div
        className={`p-2 sm:p-3 rounded-lg ${color} bg-opacity-10 flex-shrink-0 mt-0.5`}
      >
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 truncate">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </button>
);

const ManagementCard = ({ icon: Icon, title, count, onClick, color }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 text-left hover:shadow-md transition-all hover:scale-[1.02] active:scale-95 w-full touch-manipulation"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div
          className={`p-2 sm:p-3 rounded-lg ${color} bg-opacity-10 flex-shrink-0`}
        >
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 truncate">
            {count} items
          </p>
        </div>
      </div>
      <div className="text-gray-400 flex-shrink-0 ml-2">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  </button>
);

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    editorials: 0,
    bookings: 0,
    contacts: 0,
    newsletter: 0,
    carousel: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [
        productsRes,
        ordersRes,
        usersRes,
        editorialsRes,
        bookingsRes,
        contactsRes,
        newsletterRes,
        carouselRes,
      ] = await Promise.all([
        axios.get("/api/products", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get("/api/orders/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get("/api/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get("/api/editorials/admin", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get("/api/marriage-bookings/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get("/api/contacts", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get("/api/newsletter", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get("/api/carousel/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      console.log("API Responses:", {
        products: productsRes.data?.length,
        orders: ordersRes.data?.length,
        users: usersRes.data?.length,
        editorials: editorialsRes.data?.length,
        bookings: bookingsRes.data?.length,
        contacts: contactsRes.data?.length,
        newsletter: newsletterRes.data?.length,
        carousel: carouselRes.data?.length,
      });

      const revenue =
        ordersRes.data?.reduce(
          (total, order) => total + (order.totalAmount || 0),
          0
        ) || 0;

      setStats({
        products: productsRes.data?.length || 0,
        orders: ordersRes.data?.length || 0,
        users: usersRes.data?.length || 0,
        revenue: revenue,
        editorials: editorialsRes.data?.length || 0,
        bookings: bookingsRes.data?.length || 0,
        contacts: contactsRes.data?.length || 0,
        newsletter: newsletterRes.data?.length || 0,
        carousel: carouselRes.data?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      console.error("Error details:", error.response?.data || error.message);
      // Set default stats to prevent showing zeros
      setStats({
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0,
        editorials: 0,
        bookings: 0,
        contacts: 0,
        newsletter: 0,
        carousel: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Mobile-First Header */}
      <div className="bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500 shadow-lg">
        <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                Admin Dashboard
              </h1>
              <p className="text-amber-100 text-xs sm:text-sm mt-1 truncate">
                Welcome back, {user?.name || "Admin"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-First Content Container */}
      <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Mobile-First Statistics Cards */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 px-1">
            Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              icon={Package}
              title="Products"
              value={loading ? "..." : stats.products}
              color="text-blue-600"
              trend={"+12%"}
            />
            <StatCard
              icon={ShoppingCart}
              title="Orders"
              value={loading ? "..." : stats.orders}
              color="text-green-600"
              trend={"+8%"}
            />
            <StatCard
              icon={Users}
              title="Users"
              value={loading ? "..." : stats.users}
              color="text-purple-600"
              trend={"+15%"}
            />
            <StatCard
              icon={DollarSign}
              title="Revenue"
              value={
                loading ? "..." : `₹${stats.revenue?.toLocaleString() || 0}`
              }
              color="text-amber-600"
              trend={"+23%"}
            />
          </div>
        </div>

        {/* Mobile-First Quick Actions */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 px-1">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            <QuickActionCard
              icon={Plus}
              title="Add Product"
              description="Create a new product listing"
              onClick={() => navigate("/admin/add-product")}
              color="text-blue-600"
            />
            <QuickActionCard
              icon={FolderPlus}
              title="Add Category"
              description="Create a new product category"
              onClick={() => navigate("/admin/add-category")}
              color="text-teal-600"
            />
            <QuickActionCard
              icon={ImageIcon}
              title="Manage Carousel"
              description="Update homepage image slider"
              onClick={() => navigate("/admin/carousel")}
              color="text-sky-600"
            />
          </div>
        </div>

        {/* Mobile-First Management Cards */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 px-1">
            Management
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            <ManagementCard
              icon={Package}
              title="Products"
              count={stats.products}
              onClick={() => navigate("/admin/manage-products")}
              color="text-blue-600"
            />
            <ManagementCard
              icon={Folder}
              title="Manage Categories"
              count={stats.categories || 0}
              onClick={() => navigate("/admin/manage-categories")}
              color="text-teal-600"
            />
            <ManagementCard
              icon={Users}
              title="Users"
              count={stats.users}
              onClick={() => navigate("/admin/manage-users")}
              color="text-purple-600"
            />
            <ManagementCard
              icon={ImageIcon}
              title="Carousel"
              count={stats.carousel}
              onClick={() => navigate("/admin/carousel")}
              color="text-indigo-600"
            />
            <ManagementCard
              icon={Newspaper}
              title="Editorials"
              count={stats.editorials}
              onClick={() => navigate("/admin/manage-editorials")}
              color="text-amber-600"
            />
            <ManagementCard
              icon={Heart}
              title="Bookings"
              count={stats.bookings}
              onClick={() => navigate("/admin/manage-bookings")}
              color="text-pink-600"
            />
            <ManagementCard
              icon={Mail}
              title="Newsletter"
              count={stats.newsletter}
              onClick={() => navigate("/admin/manage-newsletter")}
              color="text-teal-600"
            />
            <ManagementCard
              icon={Phone}
              title="Contacts"
              count={stats.contacts}
              onClick={() => navigate("/admin/manage-contacts")}
              color="text-orange-600"
            />
          </div>
        </div>

        {/* Mobile-First Recent Activity */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 px-1">
            Recent Activity
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-center space-x-3 text-gray-500 py-4">
              <Activity className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm text-center">
                No recent activity to display
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
