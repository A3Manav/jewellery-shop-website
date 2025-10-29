import { useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Plus,
  Package,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Shield,
  Star,
  Grid,
  List,
  MoreVertical,
} from "lucide-react";

function AdminManageProducts() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      axios
        .get("/api/products", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => res.data),
    enabled: !!user,
  });

  const deleteProduct = useMutation({
    mutationFn: (id) =>
      axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      console.error("Delete error:", error.response?.data || error.message);
      toast.error("Failed to delete product");
    },
  });

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  const filteredProducts =
    products?.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || product.category?.name === selectedCategory;
      return matchesSearch && matchesCategory;
    }) || [];

  const categories =
    [...new Set(products?.map((p) => p.category?.name).filter(Boolean))] || [];

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
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
              Error loading products: {error.message}
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

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.images?.[0]?.url || "/assets/images/chudi.jpeg"}
          alt={product.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            if (!e.target.src.includes("fallback-product.jpg")) {
              e.target.src = "/assets/images/fallback-product.jpg";
            }
          }}
        />
        <div className="absolute top-2 left-2">
          <div className="flex items-center gap-1 bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            <Shield className="w-3 h-3" />
            Admin
          </div>
        </div>
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
            {product.title}
          </h3>
          <span className="text-lg font-bold text-amber-600 ml-2">
            ₹{product.price?.toLocaleString()}
          </span>
        </div>

        <div className="space-y-1 text-xs text-gray-600 mb-3">
          {product.category && (
            <p>
              Category:{" "}
              <span className="font-medium">{product.category.name}</span>
            </p>
          )}
          {product.type && (
            <p>
              Type: <span className="font-medium">{product.type}</span>
            </p>
          )}
          {product.weight && (
            <p>
              Weight: <span className="font-medium">{product.weight}g</span>
            </p>
          )}
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.hallmarked && (
            <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs">
              <Star className="w-3 h-3" />
              Certified
            </span>
          )}
          <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
            In Stock
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/admin/edit-product/${product._id}`)}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Delete "${product.title}"?`)) {
                deleteProduct.mutate(product._id);
              }
            }}
            disabled={deleteProduct.isPending}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {deleteProduct.isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const ProductListItem = ({ product }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <img
          src={product.images?.[0]?.url || "/assets/images/chudi.jpeg"}
          alt={product.title}
          className="w-16 h-16 object-cover rounded-lg"
          onError={(e) => {
            if (!e.target.src.includes("fallback-product.jpg")) {
              e.target.src = "/assets/images/fallback-product.jpg";
            }
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
            {product.title}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            {product.category?.name} • ₹{product.price?.toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            {product.hallmarked && (
              <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs">
                <Star className="w-3 h-3" />
                Certified
              </span>
            )}
            {product.discount > 0 && (
              <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs">
                {product.discount}% OFF
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/admin/edit-product/${product._id}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Delete "${product.title}"?`)) {
                deleteProduct.mutate(product._id);
              }
            }}
            disabled={deleteProduct.isPending}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            {deleteProduct.isPending ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
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
                <Package className="w-6 h-6 mr-2" />
                Manage Products
              </h1>
              <p className="text-amber-100 text-sm">
                {filteredProducts.length} of {products?.length || 0} products
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/add-product")}
              className="p-2 rounded-full bg-black bg-opacity-20 backdrop-blur-sm text-white hover:bg-opacity-30 transition-all duration-300 active:scale-95 shadow-lg border border-white border-opacity-30"
            >
              <Plus className="w-5 h-5" />
            </button>
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
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Filters and View Toggle */}
          <div className="flex items-center justify-between">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-amber-100 text-amber-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-amber-100 text-amber-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first product."}
            </p>
            <button
              onClick={() => navigate("/admin/add-product")}
              className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3"
            }
          >
            {filteredProducts.map((product) =>
              viewMode === "grid" ? (
                <ProductCard key={product._id} product={product} />
              ) : (
                <ProductListItem key={product._id} product={product} />
              )
            )}
          </div>
        )}
      </div>

      {/* Floating Add Button for Mobile */}
      <button
        onClick={() => navigate("/admin/add-product")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-amber-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-amber-700 transition-all active:scale-95 flex items-center justify-center lg:hidden"
      >
        <Plus className="w-6 h-6" />
      </button>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default AdminManageProducts;
