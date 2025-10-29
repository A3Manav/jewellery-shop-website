import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Save,
  X,
  Image as ImageIcon,
  Link,
  Calendar,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const AdminManageEditorials = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editorials, setEditorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEditorial, setEditingEditorial] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    isActive: true,
    order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchEditorials();
  }, [user, navigate]);

  const fetchEditorials = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/editorials/admin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data && response.data.data) {
        setEditorials(response.data.data);
      } else {
        setEditorials(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching editorials:", error);
      toast.error("Failed to fetch editorials. Please try again.");
      setEditorials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
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
      order: 0,
    });
    setImageFile(null);
    setImagePreview("");
    setEditingEditorial(null);
    setShowForm(false);
  };

  const handleEdit = (editorial) => {
    setEditingEditorial(editorial);
    setFormData({
      title: editorial.title,
      description: editorial.description,
      link: editorial.link,
      isActive: editorial.isActive,
      order: editorial.order,
    });
    setImagePreview(editorial.image.url);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.link) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!editingEditorial && !imageFile) {
      toast.error("Please select an image");
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("link", formData.link);
      formDataToSend.append("isActive", formData.isActive);
      formDataToSend.append("order", formData.order);

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      };

      let response;
      if (editingEditorial) {
        response = await axios.put(
          `/api/editorials/${editingEditorial._id}`,
          formDataToSend,
          config
        );
      } else {
        response = await axios.post("/api/editorials", formDataToSend, config);
      }

      toast.success(
        editingEditorial
          ? "Editorial updated successfully"
          : "Editorial created successfully"
      );
      resetForm();
      fetchEditorials();
    } catch (error) {
      console.error("Error submitting editorial:", error);
      toast.error(error.response?.data?.message || "Failed to save editorial");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this editorial?")) {
      return;
    }

    try {
      await axios.delete(`/api/editorials/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Editorial deleted successfully");
      fetchEditorials();
    } catch (error) {
      console.error("Error deleting editorial:", error);
      toast.error("Failed to delete editorial");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `/api/editorials/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Editorial status updated");
      fetchEditorials();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading editorials...</p>
        </div>
      </div>
    );
  }

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
                <Edit2 className="w-6 h-6 mr-2" />
                Manage Editorials
              </h1>
              <p className="text-amber-100 text-sm">
                {editorials.length} editorial
                {editorials.length !== 1 ? "s" : ""} total
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="p-2 rounded-full bg-black bg-opacity-20 backdrop-blur-sm text-white hover:bg-opacity-30 transition-all duration-300 active:scale-95 shadow-lg border border-white border-opacity-30"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Editorial Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[calc(100vh-1rem)] sm:max-h-[95vh] overflow-y-auto my-2 sm:my-4">
              <div className="sticky top-0 bg-white p-3 sm:p-4 md:p-6 border-b border-gray-200 rounded-t-xl sm:rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 pr-2">
                    {editingEditorial ? "Edit Editorial" : "Add New Editorial"}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 flex-shrink-0"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6"
              >
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 text-sm sm:text-base"
                    placeholder="Enter editorial title"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 text-sm sm:text-base resize-none"
                    placeholder="Enter editorial description"
                    required
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Link *
                  </label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 text-sm sm:text-base"
                    placeholder="e.g., /editorial/craftsmanship or external URL"
                    required
                  />
                </div>

                {/* Order and Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 text-sm sm:text-base"
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-center justify-center">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-200"
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        Active
                      </span>
                    </label>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image {!editingEditorial && "*"}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-amber-400 transition-colors">
                    {imagePreview ? (
                      <div className="space-y-3 sm:space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-32 sm:max-h-48 mx-auto rounded-lg shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setImageFile(null);
                          }}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                        <p className="text-gray-600 mb-2 text-sm sm:text-base">
                          Click to upload editorial image
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block mt-3 sm:mt-4 bg-amber-50 text-amber-600 px-3 sm:px-4 py-2 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors text-sm"
                    >
                      Choose Image
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-3 sm:pt-4 md:pt-6 sticky bottom-0 bg-white border-t border-gray-200 mt-4 sm:mt-6 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 sm:px-6 py-3 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    ) : (
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                    {submitting
                      ? "Saving..."
                      : editingEditorial
                      ? "Update Editorial"
                      : "Create Editorial"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Editorials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {editorials.map((editorial) => (
            <div
              key={editorial._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={editorial.image.url}
                  alt={editorial.title}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      editorial.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {editorial.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {editorial.title}
                </h3>
                <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
                  {editorial.description}
                </p>

                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                  <span>Order: {editorial.order}</span>
                  <span>
                    {new Date(editorial.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={() => handleEdit(editorial)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => toggleStatus(editorial._id)}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                      editorial.isActive
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {editorial.isActive ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    {editorial.isActive ? "Hide" : "Show"}
                  </button>

                  <button
                    onClick={() => handleDelete(editorial._id)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {editorials.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit2 className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No Editorials Yet
            </h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Get started by creating your first editorial story
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-200 text-sm sm:text-base"
            >
              Create Your First Editorial
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageEditorials;
