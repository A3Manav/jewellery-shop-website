import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Heart,
  Eye,
  ShoppingCart,
  Star,
  Gem,
  Award,
  Shield,
  Sparkles,
  Check,
  ArrowUpDown,
  Package,
  Gift,
  Crown,
  Zap,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import SEOMetaTags from "../components/SEO/SEOMetaTags";
import {
  generateOrganizationSchema,
  getJewelleryKeywords,
} from "../components/SEO/StructuredData";
import { SEO_TEMPLATES } from "../components/SEO/seoConfig";
import ProductCard from "../components/ProductCard";

function StorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Context
  const { addToCart, cart } = useContext(CartContext);
  const { addToWishlist, user } = useContext(AuthContext);

  // Calculate cart count
  const cartCount = cart.length;

  // State
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "all"
  );
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("minPrice") || "",
    max: searchParams.get("maxPrice") || "",
  });
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: [
      "allProducts",
      searchQuery,
      selectedCategory,
      selectedType,
      priceRange,
      sortBy,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (selectedType !== "all") params.append("type", selectedType);
      if (priceRange.min) params.append("minPrice", priceRange.min);
      if (priceRange.max) params.append("maxPrice", priceRange.max);
      params.append("sort", sortBy);

      const response = await axios.get(`/api/products?${params}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["allCategories"],
    queryFn: () => axios.get("/api/categories").then((res) => res.data),
    staleTime: 10 * 60 * 1000,
  });

  // Product types
  const productTypes = [
    { value: "all", label: "All Types", icon: Package },
    { value: "Jewelry", label: "Jewelry", icon: Gem },
    { value: "Pot Items", label: "Pot Items", icon: Award },
    { value: "Fashion Products", label: "Fashion Products", icon: Sparkles },
    { value: "Gift Items", label: "Gift Items", icon: Gift },
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "", label: "Default Order" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedType !== "all") params.set("type", selectedType);
    if (priceRange.min) params.set("minPrice", priceRange.min);
    if (priceRange.max) params.set("maxPrice", priceRange.max);
    if (sortBy !== "newest") params.set("sort", sortBy);

    setSearchParams(params);
  }, [
    searchQuery,
    selectedCategory,
    selectedType,
    priceRange,
    sortBy,
    setSearchParams,
  ]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && showFilters) {
        setShowFilters(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showFilters]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedType("all");
    setPriceRange({ min: "", max: "" });
    setSortBy("newest");
  };

  // Active filters count
  const activeFiltersCount = [
    searchQuery,
    selectedCategory !== "all" ? selectedCategory : null,
    selectedType !== "all" ? selectedType : null,
    priceRange.min,
    priceRange.max,
    sortBy !== "newest" ? sortBy : null,
  ].filter(Boolean).length;

  // Dynamic SEO based on filters
  const getDynamicSEO = () => {
    const category = selectedCategory !== "all" ? selectedCategory : "";
    const type = selectedType !== "all" ? selectedType : "";
    const search = searchQuery;

    let title = SEO_TEMPLATES.store.title;
    let description = SEO_TEMPLATES.store.description;
    let keywords = getJewelleryKeywords(category, type);

    if (search) {
      title = `${search} | Search Results | Abhushan Kala Kendra`;
      description = `Search results for "${search}" at Abhushan Kala Kendra. Find premium gold, silver & diamond jewellery matching your search.`;
      keywords = `${search}, ${keywords}`;
    } else if (category && category !== "all") {
      const categoryData = SEO_TEMPLATES.category(category);
      title = categoryData.title;
      description = categoryData.description;
      keywords = categoryData.keywords;
    }

    return { title, description, keywords };
  };

  const dynamicSEO = getDynamicSEO();

  return (
    <div className="min-h-screen bg-gray-50 md:pt-20">
      <SEOMetaTags
        title={dynamicSEO.title}
        description={dynamicSEO.description}
        keywords={dynamicSEO.keywords}
        canonicalUrl={`https://abhushankalakendra.vercel.app/store${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`}
        structuredData={generateOrganizationSchema()}
        ogImage="https://abhushankalakendra.vercel.app/assets/images/store-og.jpg"
      />
      {/* Hero Section */}
      <div className="bg-black text-white md:py-20 py-8">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            <span className="text-sm font-medium uppercase tracking-[0.3em] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Premium Store
            </span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent via-amber-400 to-transparent"></div>
          </div>
          <h1 className="text-6xl font-thin mb-6 tracking-tight">
            Discover Our Collection
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Explore our complete range of premium jewelry, handcrafted pottery,
            and unique gifts
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-lg border-b sticky top-0 md:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
          {/* Search Bar */}
          <div className="flex flex-row gap-3 items-center">
            {/* Back Button - Mobile Only */}
            <button
              onClick={() => navigate(-1)}
              className="md:hidden flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border transition-all duration-300 whitespace-nowrap cursor-pointer ${
                showFilters || activeFiltersCount > 0
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white text-gray-700 border-gray-200 hover:border-amber-300"
              }`}
            >
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <Filter className="w-4 h-4" />
              )}
              <span className="hidden md:inline text-sm">
                {showFilters ? "Hide Filters" : "Show Filters"}
              </span>
              <span className="md:hidden text-sm">Filters</span>
              {activeFiltersCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    showFilters
                      ? "bg-white text-amber-500"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Cart Icon - Mobile Only */}
            <Link
              to="/cart"
              className="md:hidden relative flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <>
              {/* Mobile Backdrop Overlay */}
              <div
                className="fixed inset-0 bg-black/20 z-30 md:hidden"
                onClick={() => setShowFilters(false)}
              ></div>

              <div className="bg-gray-50 rounded-2xl p-6 space-y-6 animate-slideDown shadow-lg border border-gray-200 relative z-40">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Product Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Product Type
                    </label>
                    <div className="space-y-2">
                      {productTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.value}
                            onClick={() => setSelectedType(type.value)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                              selectedType === type.value
                                ? "bg-amber-100 text-amber-800 border-2 border-amber-300"
                                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-200"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {type.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      {categories?.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Price Range (₹)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            min: e.target.value,
                          }))
                        }
                        placeholder="Min"
                        className="w-1/2 px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            max: e.target.value,
                          }))
                        }
                        placeholder="Max"
                        className="w-1/2 px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filter Action Buttons */}
                <div className="flex justify-center gap-4">
                  {/* Close Filters Button */}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 border border-blue-200 cursor-pointer"
                  >
                    <ChevronUp className="w-4 h-4" />
                    Close Filters
                  </button>

                  {/* Clear Filters Button */}
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8">
        {/* Results Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 md:mb-8 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              {productsLoading
                ? "Loading..."
                : `${products?.length || 0} Products Found`}
            </h2>
            {searchQuery && (
              <p className="text-gray-600 mt-1">
                Showing results for "
                <span className="font-medium">{searchQuery}</span>"
              </p>
            )}
          </div>

          {/* Quick Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid/List */}
        {productsLoading ? (
          <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl shadow-lg bg-white h-full flex flex-col"
              >
                <div className="relative overflow-hidden bg-gray-100 animate-pulse rounded-t-xl flex-shrink-0">
                  <div className="w-full h-72 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 shimmer-effect relative"></div>

                  {/* Loading Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="w-20 h-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full animate-pulse"></div>
                  </div>

                  {/* Loading Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="w-11 h-11 bg-gray-200 rounded-full animate-pulse shadow-lg"></div>
                    <div className="w-11 h-11 bg-gray-200 rounded-full animate-pulse shadow-lg"></div>
                  </div>
                </div>

                {/* Loading Product Info */}
                <div className="p-5 bg-white rounded-b-xl flex-grow flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3 min-h-[2.5rem]">
                      <div className="flex-1 pr-3">
                        <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      </div>
                      <div className="h-6 bg-amber-100 rounded-lg w-16 animate-pulse"></div>
                    </div>

                    <div className="flex items-center justify-between mb-4 h-5">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse"
                          ></div>
                        ))}
                        <div className="h-3 bg-gray-200 rounded w-8 ml-1 animate-pulse"></div>
                      </div>
                      <div className="h-5 bg-gray-100 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>

                  <div className="w-full h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse shadow-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products?.length > 0 ? (
          <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                className="animate-fadeInUp"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or clearing the filters
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200 cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                        max-height: 0;
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                        max-height: 500px;
                    }
                }

                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out both;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .shimmer-effect::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                    transform: translateX(-100%);
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
    </div>
  );
}

export default StorePage;
