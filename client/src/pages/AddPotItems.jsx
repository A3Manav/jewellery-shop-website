import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddPotItems({ onBack }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discount: 0,
    trending: false,
    category: "",
    description: "",
    attributes: {
      material: "",
      capacity: "",
      type: "",
    },
  });
  const [images, setImages] = useState([]);

  const VITE_API_URL =
    import.meta.env.VITE_API_URL ||
    "https://apiabhushankalakendra.vercel.app/api";
  const { data: categories } = useQuery({
    queryKey: ["categories", "Pot Items"],
    queryFn: () =>
      axios
        .get(`${VITE_API_URL}/categories?type=Pot Items`)
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
    submitData.type = "Pot Items";
    if (!submitData.category) {
      toast.error("Category is required");
      return;
    }

    // Convert price and discount to numbers
    submitData.price = Number(submitData.price);
    submitData.discount = Number(submitData.discount);

    // Validate required fields
    if (
      !submitData.title ||
      !submitData.price ||
      !submitData.category ||
      !submitData.type
    ) {
      toast.error("Please fill all required fields");
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
      toast.success("Pot item added successfully");
      navigate("/admin/manage-products");
    } catch (err) {
      toast.error("Failed to add product");
      // Optionally log error details:
      console.error(err?.response?.data || err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-6 p-3 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-teal-600"
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Add Pot Items
            </h1>
            <p className="text-gray-600 mt-2">
              Create beautiful cookware and utensil products
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-teal-100"
        >
          {/* Basic Information */}
          <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-6 border border-teal-200">
            <h3 className="text-lg font-semibold text-teal-800 mb-4 flex items-center">
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
                  Pot Item Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g., Stainless Steel Cooking Pot, Glass Water Bottle, Ceramic Dinner Set"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all duration-300 text-gray-800 placeholder-gray-400"
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all duration-300 text-gray-800"
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all duration-300 text-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pot Specifications */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pot Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="attributes.material"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Material *
                </label>
                <select
                  id="attributes.material"
                  name="attributes.material"
                  value={formData.attributes.material}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-gray-800"
                  required
                >
                  <option value="">Select Material</option>
                  <option value="Stainless Steel">Stainless Steel</option>
                  <option value="Aluminum">Aluminum</option>
                  <option value="Cast Iron">Cast Iron</option>
                  <option value="Ceramic">Ceramic</option>
                  <option value="Glass">Glass</option>
                  <option value="Non-stick Coated">Non-stick Coated</option>
                  <option value="Copper">Copper</option>
                  <option value="Enamel">Enamel</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="attributes.capacity"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Capacity/Size
                </label>
                <input
                  type="text"
                  id="attributes.capacity"
                  name="attributes.capacity"
                  placeholder="e.g., 1L, 500ml, 24cm"
                  value={formData.attributes.capacity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-gray-800"
                />
              </div>
              <div>
                <label
                  htmlFor="attributes.type"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Type *
                </label>
                <select
                  id="attributes.type"
                  name="attributes.type"
                  value={formData.attributes.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-gray-800"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Cookware">Cookware</option>
                  <option value="Serveware">Serveware</option>
                  <option value="Storage">Storage Container</option>
                  <option value="Drinkware">Drinkware</option>
                  <option value="Bakeware">Bakeware</option>
                  <option value="Kitchen Tools">Kitchen Tools</option>
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
                      formData.trending ? "bg-teal-400" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                        formData.trending ? "translate-x-6" : "translate-x-0.5"
                      } mt-0.5`}
                    ></div>
                  </div>
                </div>
                <span className="ml-3 text-sm font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">
                  Mark as Trending
                </span>
              </label>
            </div>
          </div>

          {/* Category & Description */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
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
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-800"
                  required
                >
                  <option value="">Select Pot Category</option>
                  {categories === undefined && (
                    <option disabled>Loading categories...</option>
                  )}
                  {Array.isArray(categories) && categories.length === 0 && (
                    <option disabled>No pot categories found</option>
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
                  placeholder="Describe the pot item, its features, material quality, usage instructions, and special characteristics..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Images Upload */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-200">
            <h3 className="text-lg font-semibold text-teal-800 mb-4 flex items-center">
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
            <div className="border-2 border-dashed border-teal-300 rounded-xl p-8 text-center transition-all duration-300 hover:border-teal-400 hover:bg-teal-25">
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
                  className="w-12 h-12 text-teal-400 mx-auto mb-4"
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
                <p className="text-lg font-semibold text-teal-600 mb-2">
                  Upload Pot Images
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
              <div className="mt-4 text-sm text-teal-700 bg-teal-100 rounded-lg p-3">
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
              className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-300"
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
                Add Pot Item
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPotItems;
