import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddFashion({ onBack }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discount: 0,
    trending: false,
    category: "",
    description: "",
    attributes: {
      fabric: "",
      brand: "",
      size: "",
      color: "",
      pattern: "",
    },
  });
  const [images, setImages] = useState([]);

  const VITE_API_URL =
    import.meta.env.VITE_API_URL ||
    "https://apiabhushankalakendra.vercel.app/api";
  const { data: categories } = useQuery({
    queryKey: ["categories", "Fashion Products"],
    queryFn: () =>
      axios
        .get(`${VITE_API_URL}/categories?type=Fashion Products`)
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
    submitData.type = "Fashion Products";
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
      toast.success("Fashion product added successfully");
      navigate("/admin/manage-products");
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-6 p-3 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-rose-600"
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Add Fashion Products
            </h1>
            <p className="text-gray-600 mt-2">
              Create stylish clothing and fashion accessories
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-rose-100"
        >
          {/* Basic Information */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
            <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Fashion Item Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g., Cotton Summer Dress, Silk Scarf, Designer Handbag"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 text-gray-800 placeholder-gray-400"
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 text-gray-800"
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 text-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fashion Specifications */}
          <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-6 border border-pink-200">
            <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Fashion Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="attributes.fabric"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Fabric/Material *
                </label>
                <select
                  id="attributes.fabric"
                  name="attributes.fabric"
                  value={formData.attributes.fabric}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-gray-800"
                  required
                >
                  <option value="">Select Fabric</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Silk">Silk</option>
                  <option value="Linen">Linen</option>
                  <option value="Wool">Wool</option>
                  <option value="Polyester">Polyester</option>
                  <option value="Denim">Denim</option>
                  <option value="Chiffon">Chiffon</option>
                  <option value="Georgette">Georgette</option>
                  <option value="Velvet">Velvet</option>
                  <option value="Leather">Leather</option>
                  <option value="Synthetic">Synthetic</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="attributes.brand"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Brand
                </label>
                <input
                  type="text"
                  id="attributes.brand"
                  name="attributes.brand"
                  placeholder="e.g., Zara, H&M, Local Brand"
                  value={formData.attributes.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="attributes.size"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Size *
                </label>
                <select
                  id="attributes.size"
                  name="attributes.size"
                  value={formData.attributes.size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-gray-800"
                  required
                >
                  <option value="">Select Size</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                  <option value="Free Size">Free Size</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="attributes.color"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Color *
                </label>
                <input
                  type="text"
                  id="attributes.color"
                  name="attributes.color"
                  placeholder="e.g., Red, Navy Blue, Multi"
                  value={formData.attributes.color}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-gray-800"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="attributes.pattern"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Pattern
                </label>
                <select
                  id="attributes.pattern"
                  name="attributes.pattern"
                  value={formData.attributes.pattern}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-gray-800"
                >
                  <option value="">Select Pattern</option>
                  <option value="Solid">Solid</option>
                  <option value="Striped">Striped</option>
                  <option value="Floral">Floral</option>
                  <option value="Printed">Printed</option>
                  <option value="Checkered">Checkered</option>
                  <option value="Polka Dot">Polka Dot</option>
                  <option value="Abstract">Abstract</option>
                  <option value="Geometric">Geometric</option>
                </select>
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
                      formData.trending ? "bg-rose-400" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                        formData.trending ? "translate-x-6" : "translate-x-0.5"
                      } mt-0.5`}
                    ></div>
                  </div>
                </div>
                <span className="ml-3 text-sm font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
                  Mark as Trending
                </span>
              </label>
            </div>
          </div>

          {/* Category & Description */}
          <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
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
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-300 text-gray-800"
                  required
                >
                  <option value="">Select Fashion Category</option>
                  {categories === undefined && (
                    <option disabled>Loading categories...</option>
                  )}
                  {Array.isArray(categories) && categories.length === 0 && (
                    <option disabled>No fashion categories found</option>
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
                  placeholder="Describe the fashion item, its style, fit, fabric quality, care instructions, and unique features..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-300 text-gray-800 placeholder-gray-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Images Upload */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
            <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
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
            <div className="border-2 border-dashed border-rose-300 rounded-xl p-8 text-center transition-all duration-300 hover:border-rose-400 hover:bg-rose-25">
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
                  className="w-12 h-12 text-rose-400 mx-auto mb-4"
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
                <p className="text-lg font-semibold text-rose-600 mb-2">
                  Upload Fashion Images
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
              <div className="mt-4 text-sm text-rose-700 bg-rose-100 rounded-lg p-3">
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
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-rose-300"
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
                Add Fashion Product
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFashion;
