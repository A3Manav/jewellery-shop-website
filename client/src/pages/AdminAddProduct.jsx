import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Gem,
  Coffee,
  Shirt,
  Gift,
  Sparkles,
  Plus,
} from "lucide-react";
import AddJewelry from "./AddJewelry";
import AddPotItems from "./AddPotItems";
import AddFashion from "./AddFashion";
import AddGiftItems from "./AddGiftItems";

function AdminAddProduct() {
  const navigate = useNavigate();
  const [selectedProductType, setSelectedProductType] = useState(null);

  const productTypes = [
    {
      name: "Jewelry",
      icon: Gem,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      description: "Add gold, silver, or other jewelry items",
      component: <AddJewelry onBack={() => setSelectedProductType(null)} />,
    },
    {
      name: "Pot Items",
      icon: Coffee,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      description: "Add pots, utensils, or kitchen items",
      component: <AddPotItems onBack={() => setSelectedProductType(null)} />,
    },
    {
      name: "Fashion Products",
      icon: Shirt,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Add clothing, accessories, or fashion items",
      component: <AddFashion onBack={() => setSelectedProductType(null)} />,
    },
    {
      name: "Gift Items",
      icon: Gift,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      description: "Add custom printed or gift items",
      component: <AddGiftItems onBack={() => setSelectedProductType(null)} />,
    },
  ];

  if (selectedProductType) {
    const selected = productTypes.find(
      (type) => type.name === selectedProductType
    );
    return selected.component;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 md:pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-lg">
        <div className="px-4 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="p-2 rounded-full bg-black bg-opacity-20 backdrop-blur-sm text-white hover:bg-opacity-30 transition-all duration-300 active:scale-95 shadow-lg border border-white border-opacity-30"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                <Plus className="w-6 h-6 mr-2" />
                Add New Product
              </h1>
              <p className="text-amber-100 text-sm mt-1">
                Choose a product category to get started
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-100">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Categories
                </h2>
                <p className="text-sm text-gray-600">
                  Select a category to add your product
                </p>
              </div>
            </div>
          </div>

          {/* Product Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {productTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.name}
                  onClick={() => setSelectedProductType(type.name)}
                  className={`${type.bgColor} ${type.borderColor} border-2 rounded-2xl p-6 text-left hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-xl bg-white shadow-sm group-hover:shadow-md transition-shadow`}
                    >
                      <IconComponent className={`w-8 h-8 ${type.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {type.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {type.description}
                      </p>
                      <div className="mt-4 flex items-center text-sm font-medium text-gray-700">
                        <span>Get Started</span>
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-lg bg-blue-100">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Each category has a specialized form to help you add products
                  with the right details and specifications.
                </p>
                <div className="text-xs text-gray-500">
                  • Make sure to upload high-quality images • Fill in all
                  required fields for better visibility • Use descriptive titles
                  and detailed descriptions
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAddProduct;
