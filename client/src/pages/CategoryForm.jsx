import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  FolderPlus,
  Tag,
  Package,
  Upload,
  Check,
  X,
  Image as ImageIcon,
  Save,
} from "lucide-react";

function CategoryForm() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    type: "Jewelry",
    image: null,
  });
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/login");
      return;
    }

    if (id) {
      setIsEditing(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/categories/${id}`)
        .then((response) => {
          const { name, type, image } = response.data;
          setFormData({ name, type, image: null });
          if (image && image.url) {
            setExistingImageUrl(image.url);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching category:", error);
          toast.error("Failed to fetch category details");
          navigate("/admin/manage-categories");
        });
    } else {
      setLoading(false);
    }
  }, [id, user, navigate]);

  if (user?.role !== "admin") {
    navigate("/login");
    return null;
  }

  const productTypes = [
    "Jewelry",
    "Pot Items",
    "Fashion Products",
    "Gift Items",
    "Custom Printed Products",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name || !formData.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (!formData.type) {
      toast.error("Please select a category type");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("type", formData.type);
    if (formData.image) {
      data.append("image", formData.image);
    }

    console.log(`📤 Submitting category (edit: ${isEditing}):`, {
      name: formData.name.trim(),
      type: formData.type,
      hasImage: !!formData.image,
    });

    try {
      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/categories/${id}`
        : `${import.meta.env.VITE_API_URL}/categories`;
      const method = isEditing ? "put" : "post";

      const response = await axios[method](url, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(
        `✅ Category ${isEditing ? "updated" : "created"}:`,
        response.data
      );
      toast.success(
        `Category ${isEditing ? "updated" : "created"} successfully`
      );
      navigate("/admin/manage-categories");
    } catch (error) {
      console.error(
        `❌ Error ${isEditing ? "updating" : "creating"} category:`,
        error.response?.data || error.message
      );
      const errorMsg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        `Failed to ${isEditing ? "update" : "create"} category`;
      toast.error(errorMsg);

      // Log detailed error info
      if (error.response?.data?.received) {
        console.log("Backend received:", error.response.data.received);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                navigate(
                  isEditing ? "/admin/manage-categories" : "/admin/dashboard"
                )
              }
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FolderPlus className="w-8 h-8 text-purple-500 mr-3" />
                {isEditing ? "Edit Category" : "Create New Category"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing
                  ? "Update the details for this category"
                  : "Add a new category to organize your products"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Category Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700 flex items-center"
              >
                <Tag className="w-4 h-4 text-purple-500 mr-2" />
                Category Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-300 text-lg"
                placeholder="Enter category name (e.g., Gold Rings, Silver Necklaces)"
                required
              />
              <p className="text-sm text-gray-500">
                Choose a descriptive name that customers will easily understand
              </p>
            </div>

            {/* Product Type */}
            <div className="space-y-2">
              <label
                htmlFor="type"
                className="text-sm font-semibold text-gray-700 flex items-center"
              >
                <Package className="w-4 h-4 text-purple-500 mr-2" />
                Product Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-300 text-lg"
                required
              >
                {productTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500">
                Select the main product type for this category
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <ImageIcon className="w-4 h-4 text-purple-500 mr-2" />
                Category Image (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                {formData.image ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {formData.image.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        New file selected. This will replace the old image.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: null }))
                      }
                      className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel Change
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {existingImageUrl && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Current Image:
                        </p>
                        <img
                          src={existingImageUrl}
                          alt="Current category"
                          className="w-32 h-32 object-cover mx-auto rounded-lg shadow-md"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-purple-100 rounded-full">
                      <Upload className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {isEditing
                          ? "Upload New Image"
                          : "Upload Category Image"}
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG or JPEG up to 10MB
                      </p>
                    </div>
                    <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                      <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleFileChange}
                        accept="image/jpeg,image/jpg,image/png"
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    isEditing ? "/admin/manage-categories" : "/admin/dashboard"
                  )
                }
                className="flex-1 flex items-center justify-center px-6 py-4 bg-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="flex-2 flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[200px]"
              >
                {isEditing ? (
                  <>
                    <Save className="w-5 h-5 mr-2" /> Update Category
                  </>
                ) : (
                  <>
                    <FolderPlus className="w-5 h-5 mr-2" /> Create Category
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Category Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-purple-800">
            <li className="flex items-start">
              <Check className="w-4 h-4 mr-2 mt-0.5 text-purple-600" />
              Use clear, descriptive names that customers will understand
            </li>
            <li className="flex items-start">
              <Check className="w-4 h-4 mr-2 mt-0.5 text-purple-600" />
              Select the appropriate product type to organize your inventory
            </li>
            <li className="flex items-start">
              <Check className="w-4 h-4 mr-2 mt-0.5 text-purple-600" />
              Upload a high-quality image to make the category more appealing
            </li>
            <li className="flex items-start">
              <Check className="w-4 h-4 mr-2 mt-0.5 text-purple-600" />
              Categories help customers find products faster and improve site
              organization
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CategoryForm;
