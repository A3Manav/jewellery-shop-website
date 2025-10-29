import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { fetchDashboardData } from "../services/adminAPI";
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
  Star,
  Mail,
  BookOpen,
  Heart,
  Newspaper,
  Image as ImageIcon,
  Phone,
} from "lucide-react";

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/login");
    } else if (user) {
      loadDashboardData();
    }
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardData();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error("Dashboard error:", err);

      // Check if it's an authorization error
      if (err.message.includes("403") || err.message.includes("Forbidden")) {
        setError(
          "Access denied: You need admin privileges to view this page. Please contact an administrator."
        );
      } else if (err.message.includes("401")) {
        setError("Your session has expired. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to load dashboard data: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              <span className="text-gold-500">LUXE</span> Admin
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user.name}</span>
              <div className="h-8 w-8 rounded-full bg-gold-500 flex items-center justify-center text-black font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-gray-800 mb-2">
            Dashboard Overview
          </h2>
          <div className="w-20 h-1 bg-gold-500"></div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="mb-12 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}{" "}
            <button
              onClick={loadDashboardData}
              className="ml-2 text-gold-500 font-medium"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard
                title="Total Users"
                value={stats.stats?.totalUsers || 0}
                icon="👥"
              />
              <StatCard
                title="Total Products"
                value={stats.stats?.totalProducts || 0}
                icon="💎"
              />
              <StatCard
                title="Orders"
                value={stats.stats?.totalOrders || 0}
                icon="📦"
              />
              <StatCard
                title="Bookings"
                value={stats.stats?.totalBookings || 0}
                icon="💍"
              />
              <StatCard
                title="Reviews"
                value={stats.stats?.totalReviews || 0}
                icon="⭐"
              />
              <StatCard
                title="Monthly Revenue"
                value={
                  stats.stats?.monthlyRevenue
                    ? `₹${stats.stats.monthlyRevenue.toLocaleString()}`
                    : "₹0"
                }
                icon="💰"
              />
              <StatCard
                title="Avg Rating"
                value={
                  stats.stats?.averageRating
                    ? `${stats.stats.averageRating}/5`
                    : "N/A"
                }
                icon="🌟"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Recent Orders
                </h3>
                <div className="space-y-3">
                  {stats.recentOrders?.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium text-sm">{order.user}</p>
                        <p className="text-xs text-gray-600">
                          {order.itemCount} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          ₹{order.totalAmount}
                        </p>
                        <p className="text-xs text-gray-600">{order.status}</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-sm">No recent orders</p>
                  )}
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Recent Bookings
                </h3>
                <div className="space-y-3">
                  {stats.recentBookings?.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium text-sm">{booking.user}</p>
                        <p className="text-xs text-gray-600">
                          {booking.productType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">
                          {booking.status}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-sm">No recent bookings</p>
                  )}
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Recent Reviews
                </h3>
                <div className="space-y-3">
                  {stats.recentReviews?.slice(0, 5).map((review) => (
                    <div key={review.id} className="p-3 bg-gray-50 rounded">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-sm">{review.user}</p>
                        <p className="text-xs text-yellow-600">
                          ⭐ {review.rating}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {review.product}
                      </p>
                      <p className="text-xs text-gray-500">{review.comment}</p>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-sm">No recent reviews</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Add Product"
            to="/admin/add-product"
            icon="➕"
            description="Add new jewelry items to your collection"
          />
          <DashboardCard
            title="Manage Products"
            to="/admin/manage-products"
            icon="💎"
            description="View, edit or remove existing products"
          />
          <DashboardCard
            title="Manage Users"
            to="/admin/manage-users"
            icon="👥"
            description="Manage customer and staff accounts"
          />
          <DashboardCard
            title="Manage Rates"
            to="/admin/manage-rates"
            icon="⭐"
            description="Update product ratings and reviews"
          />
          <DashboardCard
            title="Manage Orders"
            to="/admin/manage-orders"
            icon="📦"
            description="Process and track customer orders"
          />
          <DashboardCard
            title="Manage Bookings"
            to="/admin/manage-bookings"
            icon="📅"
            description="View and manage appointment bookings"
          />
          <DashboardCard
            title="Add Category"
            to="/admin/add-category"
            icon="🏷️"
            description="Create new product categories"
          />
          <DashboardCard
            title="Manage Editorials"
            to="/admin/manage-editorials"
            icon="📝"
            description="Manage editorial stories and content"
          />
          <DashboardCard
            title="Manage Contacts"
            to="/admin/manage-contacts"
            icon="💬"
            description="View and respond to contact form submissions"
          />
          <DashboardCard
            title="Manage Newsletter"
            to="/admin/manage-newsletter"
            icon="📧"
            description="Manage newsletter subscribers and send campaigns"
          />
        </div>
      </main>
    </div>
  );
}

const DashboardCard = ({ title, to, icon, description }) => {
  return (
    <Link to={to} className="group">
      <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-lg h-full flex flex-col">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">{icon}</span>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-500 text-sm flex-grow">{description}</p>
        <div className="mt-4 flex justify-end">
          <span className="text-gold-500 text-sm font-medium">
            Go to {title} →
          </span>
        </div>
      </div>
    </Link>
  );
};

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gold-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
        {icon && <div className="text-3xl opacity-80">{icon}</div>}
      </div>
    </div>
  );
};

const StatCardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gold-500 animate-pulse">
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
      <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
    </div>
  );
};

const LoadingSpinner = ({ fullScreen = false }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen" : ""
      }`}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
    </div>
  );
};

export default AdminDashboard;
