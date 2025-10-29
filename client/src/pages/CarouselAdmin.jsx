import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Trash2,
  Edit,
  Plus,
  Image,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function CarouselAdmin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    isActive: true,
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Check admin access
  React.useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch all carousel items
  const {
    data: carousels,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["carouselsAdmin"],
    queryFn: () =>
      axios
        .get("/api/carousel/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => res.data),
    enabled: !!user && user.role === "admin",
  });

  // Mutation for creating carousel item
  const createMutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("link", data.link);
      formData.append("isActive", data.isActive);
      if (data.image) {
        formData.append("image", data.image);
      }

      return axios.post("/api/carousel", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["carouselsAdmin"]);
      queryClient.invalidateQueries(["carousel"]);
      resetForm();
      toast.success("Carousel item created successfully!");
    },
    onError: (error) => {
      toast.error(
        "Error creating carousel item: " +
          (error.response?.data?.message || error.message)
      );
    },
  });

  // Mutation for updating carousel item
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("link", data.link);
      formData.append("isActive", data.isActive);
      if (data.image) {
        formData.append("image", data.image);
      }

      return axios.put(`/api/carousel/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["carouselsAdmin"]);
      queryClient.invalidateQueries(["carousel"]);
      resetForm();
      toast.success("Carousel item updated successfully!");
    },
    onError: (error) => {
      toast.error(
        "Error updating carousel item: " +
          (error.response?.data?.message || error.message)
      );
    },
  });

  // Mutation for deleting carousel item
  const deleteMutation = useMutation({
    mutationFn: (id) =>
      axios.delete(`/api/carousel/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["carouselsAdmin"]);
      queryClient.invalidateQueries(["carousel"]);
      toast.success("Carousel item deleted successfully!");
    },
    onError: (error) => {
      toast.error(
        "Error deleting carousel item: " +
          (error.response?.data?.message || error.message)
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (carousel) => {
    setFormData({
      title: carousel.title,
      description: carousel.description,
      link: carousel.link || "",
      isActive: carousel.isActive,
      image: null,
    });
    setEditingId(carousel._id);
    setImagePreview(carousel.imageUrl);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this carousel item?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      link: "",
      isActive: true,
      image: null,
    });
    setEditingId(null);
    setImagePreview(null);
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
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
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                Carousel Management
              </h1>
              <p className="text-amber-100 text-xs sm:text-sm mt-1 truncate">
                {editingId
                  ? "Edit carousel item"
                  : "Manage homepage carousel banners"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 rounded-lg bg-amber-100">
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {editingId ? "Edit Carousel Item" : "Add New Carousel Item"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Image Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Carousel Image
              </label>
              <div className="flex flex-col space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-colors"
                />
                {imagePreview && (
                  <div className="relative w-full h-32 sm:h-48 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900"
                placeholder="Enter carousel title"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 resize-none"
                placeholder="Enter carousel description"
              />
            </div>

            {/* Link */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Link (Optional)
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900"
                placeholder="https://example.com"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-700"
              >
                Active (visible on homepage)
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>{editingId ? "Update Item" : "Add Item"}</span>
                  </>
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Carousel Items List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 rounded-lg bg-blue-100">
              <Image className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Current Carousel Items ({carousels?.length || 0})
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">
                Error loading carousel items: {error.message}
              </p>
            </div>
          ) : !carousels || carousels.length === 0 ? (
            <div className="text-center py-8">
              <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                No carousel items found. Add your first item above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {carousels.map((carousel, index) => (
                <div
                  key={carousel._id}
                  className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full sm:w-32 h-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {carousel.imageUrl ? (
                        <img
                          src={carousel.imageUrl}
                          alt={carousel.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {carousel.title || "Untitled"}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {carousel.description || "No description"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                          {carousel.isActive ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Eye className="w-3 h-3 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <EyeOff className="w-3 h-3 mr-1" />
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <button
                          onClick={() => handleEdit(carousel)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(carousel._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </button>
                        {carousel.link && (
                          <a
                            href={carousel.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Link
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CarouselAdmin;
