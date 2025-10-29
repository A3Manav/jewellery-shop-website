import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddGiftItems({ onBack }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discount: 0,
    trending: false,
    category: "",
    description: "",
    attributes: {
      customization: "",
      occasion: "",
      personalizationOptions: "",
      giftType: "",
    },
  });
  const [images, setImages] = useState([]);

  const VITE_API_URL =
    import.meta.env.VITE_API_URL ||
    "https://apiabhushankalakendra.vercel.app/api";
  const { data: categories } = useQuery({
    queryKey: ["categories", "Gift Items"],
    queryFn: () =>
      axios
        .get(`${VITE_API_URL}/categories?type=Gift Items`)
        .then((res) => res.data),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("attributes.")) {
      const attrName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        attributes: { ...prev.attributes, [attrName]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  function generateUniqueId() {
    return "prod_" + Math.random().toString(36).substr(2, 9) + Date.now();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (!submitData.productId) submitData.productId = generateUniqueId();
    submitData.type = "Gift Items";
    if (!submitData.category) {
      toast.error("Category is required");
      return;
    }

    const data = new FormData();
    data.append("productId", submitData.productId);
    data.append("title", submitData.title);
    data.append("price", submitData.price);
    data.append("discount", submitData.discount);
    data.append("trending", submitData.trending);
    data.append("category", submitData.category);
    data.append("description", submitData.description);
    data.append("type", submitData.type);
    data.append("attributes", JSON.stringify(submitData.attributes));
    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    try {
      await axios.post(`${VITE_API_URL}/products`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Gift item added successfully");
      navigate("/admin/manage-products");
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-6 p-3 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-600"
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
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Add Gift & Custom Items
            </h1>
            <p className="text-gray-600 mt-2">
              Create personalized gifts and custom products
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-purple-100"
        >
          {/* Basic Information */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Gift Item Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g., Custom Photo Frame, Personalized Mug, Engraved Keychain"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-800 placeholder-gray-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gift Customization */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
            <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Customization & Personalization
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label
                  htmlFor="attributes.customization"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Customization Type *
                </label>
                <select
                  id="attributes.customization"
                  name="attributes.customization"
                  value={formData.attributes.customization}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-gray-800"
                  required
                >
                  <option value="">Select Customization Type</option>
                  <option value="Name Engraving">Name Engraving</option>
                  <option value="Photo Printing">Photo Printing</option>
                  <option value="Text Personalization">
                    Text Personalization
                  </option>
                  <option value="Custom Design">Custom Design</option>
                  <option value="Color Customization">
                    Color Customization
                  </option>
                  <option value="Size Customization">Size Customization</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="attributes.occasion"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Occasion
                  </label>
                  <select
                    id="attributes.occasion"
                    name="attributes.occasion"
                    value={formData.attributes.occasion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-gray-800"
                  >
                    <option value="">Select Occasion</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Valentine's Day">Valentine's Day</option>
                    <option value="Mother's Day">Mother's Day</option>
                    <option value="Father's Day">Father's Day</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Corporate">Corporate Gift</option>
                    <option value="Festival">Festival</option>
                    <option value="Any Occasion">Any Occasion</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="attributes.giftType"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Gift Type
                  </label>
                  <select
                    id="attributes.giftType"
                    name="attributes.giftType"
                    value={formData.attributes.giftType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-gray-800"
                  >
                    <option value="">Select Gift Type</option>
                    <option value="Photo Gift">Photo Gift</option>
                    <option value="Personalized Accessory">
                      Personalized Accessory
                    </option>
                    <option value="Custom Artwork">Custom Artwork</option>
                    <option value="Decorative Item">Decorative Item</option>
                    <option value="Functional Gift">Functional Gift</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="attributes.personalizationOptions"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Personalization Options
                </label>
                <textarea
                  id="attributes.personalizationOptions"
                  name="attributes.personalizationOptions"
                  placeholder="Describe available personalization options (e.g., font styles, colors, sizes, materials, etc.)"
                  value={formData.attributes.personalizationOptions}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-gray-800 placeholder-gray-400 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="trending"
                    checked={formData.trending}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      formData.trending ? "bg-pink-400" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                        formData.trending ? "translate-x-6" : "translate-x-0.5"
                      } mt-0.5`}
                    ></div>
                  </div>
                </div>
                <span className="ml-3 text-sm font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                  Mark as Trending
                </span>
              </label>
            </div>
          </div>

          {/* Category & Description */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Category & Details
            </h3>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-800"
                  required
                >
                  <option value="">Select Gift Category</option>
                  {categories === undefined && (
                    <option disabled>Loading categories...</option>
                  )}
                  {Array.isArray(categories) && categories.length === 0 && (
                    <option disabled>No gift categories found</option>
                  )}
                  {Array.isArray(categories) &&
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the gift item, customization process, materials used, and special features..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-800 placeholder-gray-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Images Upload */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              Product Images
            </h3>
            <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center transition-all duration-300 hover:border-purple-400 hover:bg-purple-25">
              <input
                type="file"
                id="images"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="images" className="cursor-pointer">
                <svg
                  className="w-12 h-12 text-purple-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 48 48"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  />
                </svg>
                <p className="text-lg font-semibold text-purple-600 mb-2">
                  Upload Gift Images
                </p>
                <p className="text-sm text-gray-500">
                  Click to select or drag and drop multiple images
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  PNG, JPG, JPEG, WEBP up to 10MB each
                </p>
              </label>
            </div>
            {images.length > 0 && (
              <div className="mt-4 text-sm text-purple-700 bg-purple-100 rounded-lg p-3">
                <p className="font-semibold">
                  {images.length} image(s) selected
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Gift Item
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddGiftItems;
