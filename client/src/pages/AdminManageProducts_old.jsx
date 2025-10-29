import { useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";
import { Shield } from "lucide-react";

function AdminManageProducts() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  if (!user || isLoading) {
    return (
      <div className="pt-20 container mx-auto px-4 text-center">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 container mx-auto px-4 text-center text-red-600">
        Error loading products: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="mr-6 p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              <span className="text-sm font-medium uppercase tracking-[0.3em] flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Admin Panel
              </span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent via-blue-400 to-transparent"></div>
            </div>
          </div>
          <h1 className="text-5xl font-thin mb-4 tracking-tight">
            Manage Products
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            Add, edit, and manage your product inventory
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Products ({products?.length || 0})
          </h2>
          <button
            onClick={() => navigate("/admin/add-product")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Add New Product
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {products?.map((product) => (
            <div
              key={product._id}
              className="group relative overflow-hidden rounded-xl shadow-lg bg-white hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
            >
              {/* Admin Badge */}
              <div className="absolute top-4 left-4 z-20">
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </div>
              </div>

              {/* Product Image */}
              <div className="relative overflow-hidden bg-white rounded-t-xl flex-shrink-0">
                <img
                  src={product.images?.[0]?.url || "/assets/images/chudi.jpeg"}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    if (!e.target.src.includes("fallback-product.jpg")) {
                      e.target.src = "/assets/images/fallback-product.jpg";
                    }
                  }}
                />
                {/* Overlay for better readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
              </div>

              {/* Product Info */}
              <div className="p-5 bg-white rounded-b-xl flex-grow flex flex-col justify-between">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3 min-h-[2.5rem]">
                    <h3 className="text-sm font-semibold text-gray-900 tracking-wide flex-1 pr-3 line-clamp-2 leading-5">
                      {product.title}
                    </h3>
                    <span className="text-sm font-bold text-gray-900 whitespace-nowrap bg-green-50 px-2 py-1 rounded-lg">
                      ₹{product.price?.toLocaleString()}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-2 text-xs text-gray-600">
                    {product.productId && (
                      <p>
                        ID:{" "}
                        <span className="font-mono text-gray-800">
                          {product.productId}
                        </span>
                      </p>
                    )}
                    {product.category && (
                      <p>
                        Category:{" "}
                        <span className="font-medium text-gray-800">
                          {product.category.name}
                        </span>
                      </p>
                    )}
                    {product.type && (
                      <p>
                        Type:{" "}
                        <span className="font-medium text-gray-800">
                          {product.type}
                        </span>
                      </p>
                    )}
                    {product.weight && (
                      <p>
                        Weight:{" "}
                        <span className="font-medium text-gray-800">
                          {product.weight}g
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Status Indicators */}
                  <div className="flex items-center gap-2 mt-3">
                    {product.hallmarked && (
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-xs">
                        <Shield className="w-3 h-3 text-yellow-600" />
                        <span className="text-yellow-700 font-medium">
                          Certified
                        </span>
                      </div>
                    )}
                    {product.discount > 0 && (
                      <div className="bg-red-50 px-2 py-1 rounded text-xs">
                        <span className="text-red-700 font-medium">
                          {product.discount}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/edit-product/${product._id}`)
                    }
                    className="flex-1 py-2.5 px-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-1"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${product.title}"?`
                        )
                      ) {
                        deleteProduct.mutate(product._id);
                      }
                    }}
                    disabled={deleteProduct.isPending}
                    className="flex-1 py-2.5 px-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteProduct.isPending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Admin Hover Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/5 via-transparent to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for line clamping */}
      <style>{`
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
