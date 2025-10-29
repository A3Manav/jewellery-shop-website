import { useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function AdminEditProduct() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      axios
        .get(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => res.data),
    enabled: !!user,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => axios.get("/api/categories").then((res) => res.data),
    enabled: !!user,
  });

  const [productType, setProductType] = useState("Jewelry");
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discount: 0,
    weight: "",
    hallmarked: false,
    trending: false,
    category: "",
    description: "",
    attributes: {},
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        price: product.price || "",
        discount: product.discount || 0,
        weight: product.weight || "",
        hallmarked: product.hallmarked || false,
        trending: product.trending || false,
        category: product.category?._id || "",
        description: product.description || "",
        attributes: product.attributes || {},
      });
      setProductType(product.type || "Jewelry");
    }
  }, [product]);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  const updateProduct = useMutation({
    mutationFn: (data) =>
      axios.put(`/api/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
      navigate("/admin/manage-products");
    },
    onError: (error) => {
      console.error("Update error:", error.response?.data || error.message);
      toast.error("Failed to update product");
    },
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("discount", formData.discount);
    data.append("weight", formData.weight);
    data.append("hallmarked", formData.hallmarked);
    data.append("trending", formData.trending);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("type", productType);
    data.append("attributes", JSON.stringify(formData.attributes));
    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }
    updateProduct.mutate(data);
  };

  const productTypes = [
    "Jewelry",
    "Pot Items",
    "Fashion Products",
    "Gift Items",
    "Custom Printed Products",
  ];

  const typeSpecificFields = {
    Jewelry: [
      {
        name: "material",
        label: "Material",
        type: "text",
        placeholder: "e.g., Gold, Silver",
      },
      {
        name: "gemstone",
        label: "Gemstone",
        type: "text",
        placeholder: "e.g., Diamond, Ruby",
      },
    ],
    PotItems: [
      {
        name: "material",
        label: "Material",
        type: "text",
        placeholder: "e.g., Stainless Steel, Glass",
      },
      {
        name: "capacity",
        label: "Capacity",
        type: "text",
        placeholder: "e.g., 500ml, 2L",
      },
    ],
    FashionProducts: [
      {
        name: "material",
        label: "Material",
        type: "text",
        placeholder: "e.g., Silver, Leather",
      },
      {
        name: "style",
        label: "Style",
        type: "text",
        placeholder: "e.g., Modern, Traditional",
      },
    ],
    GiftItems: [
      {
        name: "customization",
        label: "Customization Details",
        type: "text",
        placeholder: "e.g., Engraved Name",
      },
      {
        name: "occasion",
        label: "Occasion",
        type: "text",
        placeholder: "e.g., Birthday, Anniversary",
      },
    ],
    CustomPrintedProducts: [
      {
        name: "printDesign",
        label: "Print Design",
        type: "text",
        placeholder: "e.g., Custom Text, Logo",
      },
      {
        name: "material",
        label: "Material",
        type: "text",
        placeholder: "e.g., Cotton, Ceramic",
      },
    ],
  };

  if (!user || productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/admin/manage-products")}
            className="mr-6 p-3 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-orange-600"
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
          <h2 className="text-3xl font-extrabold text-gray-900">
            Edit Product
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-lg shadow-md"
        >
          <div>
            <label
              htmlFor="productType"
              className="block text-sm font-medium text-gray-700"
            >
              Product Type
            </label>
            <select
              id="productType"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            >
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Product Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Product Title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price (₹)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Price (₹)"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="discount"
              className="block text-sm font-medium text-gray-700"
            >
              Discount (%)
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              placeholder="Discount (%)"
              value={formData.discount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700"
            >
              Weight (g)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              placeholder="Weight (g)"
              value={formData.weight}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              required
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="hallmarked"
                checked={formData.hallmarked}
                onChange={handleChange}
                className="mr-2 accent-blue-500"
              />
              Hallmarked
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="trending"
                checked={formData.trending}
                onChange={handleChange}
                className="mr-2 accent-blue-500"
              />
              Trending
            </label>
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              required
            >
              <option value="">Select Category</option>
              {categories === undefined && <option disabled>Loading...</option>}
              {Array.isArray(categories) && categories.length === 0 && (
                <option disabled>No categories found</option>
              )}
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            />
          </div>
          {typeSpecificFields[productType.replace(" ", "")].map((field) => (
            <div key={field.name}>
              <label
                htmlFor={`attributes.${field.name}`}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <input
                type={field.type}
                id={`attributes.${field.name}`}
                name={`attributes.${field.name}`}
                placeholder={field.placeholder}
                value={formData.attributes[field.name] || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
          ))}
          <div>
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-700"
            >
              Images
            </label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminEditProduct;
