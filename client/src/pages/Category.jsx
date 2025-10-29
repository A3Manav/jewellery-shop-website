import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { useState } from "react";
import { Search, Filter, X, ChevronDown, ArrowLeft } from "lucide-react";

function Category() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  // FIXED: use object form for useQuery
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ["category", id],
    queryFn: () => axios.get(`/api/categories/${id}`).then((res) => res.data),
  });

  const {
    data: products,
    isLoading: productsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", id, search, sort, minPrice, maxPrice],
    queryFn: () =>
      axios
        .get(
          `/api/products?category=${id}&search=${search}&sort=${sort}&minPrice=${minPrice}&maxPrice=${maxPrice}`
        )
        .then((res) => res.data),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => axios.get("/api/categories").then((res) => res.data),
  });

  // Add state for selected category
  const [selectedCategory, setSelectedCategory] = useState(id || "");

  // Handler for changing category
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSearchParams({
      ...Object.fromEntries(searchParams),
      category: e.target.value,
    });
  };

  // Function to update search params without losing others
  const updateParams = (key, value) => {
    const newParams = { ...Object.fromEntries(searchParams), [key]: value };
    if (!value) delete newParams[key]; // remove empty values
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({ category: id }); // Keep category but clear other filters
  };

  const hasActiveFilters = search || sort || minPrice || maxPrice;

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Premium Header */}
      <div className="bg-black text-white pt-20 pb-8 md:pb-12">
        <div className="container mx-auto px-4">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link
              to="/store"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back to Store</span>
            </Link>
          </div>

          <div className="text-center">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full border border-amber-400/30">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                <span className="text-amber-400 text-sm font-medium tracking-wide">
                  CATEGORY COLLECTION
                </span>
              </div>
            </div>

            {categoryLoading ? (
              <div className="flex items-center justify-center gap-3 my-8">
                <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-300">Loading category...</span>
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-wide mb-4">
                  <span className="bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
                    {category?.name || "Category"}
                  </span>
                </h1>
                <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                  Discover our curated collection of premium products in this
                  category.
                  <span className="text-amber-400 font-medium">
                    {" "}
                    Each item is carefully selected for quality and
                    authenticity.
                  </span>
                </p>
                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                    <span className="hidden sm:inline">Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                    <span className="hidden sm:inline">Authentic Designs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                    <span className="hidden sm:inline">
                      Trusted Craftsmanship
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile-First Compact Filter Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => updateParams("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                hasActiveFilters
                  ? "bg-amber-50 border-amber-300 text-amber-700"
                  : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                Filter
              </span>
              {hasActiveFilters && (
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear all filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Sort by Price
                  </label>
                  <select
                    value={sort}
                    onChange={(e) => updateParams("sort", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="">Default</option>
                    <option value="low-to-high">Low to High</option>
                    <option value="high-to-low">High to Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="₹ Min"
                    value={minPrice}
                    onChange={(e) => updateParams("minPrice", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="₹ Max"
                    value={maxPrice}
                    onChange={(e) => updateParams("maxPrice", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Quick Actions
                  </label>
                  <button
                    onClick={clearFilters}
                    className="w-full px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {isError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error?.message}
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-6">
        {/* Results Summary */}
        {products && (
          <div className="mb-6 text-sm text-gray-600 flex items-center justify-between">
            <span>
              {products.length} {products.length === 1 ? "product" : "products"}{" "}
              found
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {productsLoading && (
            <div className="col-span-full flex items-center justify-center py-16">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading products...</span>
              </div>
            </div>
          )}

          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}

          {products?.length === 0 && !productsLoading && (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-400 mb-2">
                <Search className="w-12 h-12 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filters
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;
