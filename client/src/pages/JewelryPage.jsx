// src/pages/JewelryPage.jsx
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { Search, Filter, SortAsc, X, ChevronDown } from "lucide-react";

const JewelryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const gender = searchParams.get("gender") || "";

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", "Jewelry", search, sort, minPrice, maxPrice, gender],
    queryFn: () =>
      axios
        .get(
          `/api/products?type=Jewelry&search=${search}&sort=${sort}&minPrice=${minPrice}&maxPrice=${maxPrice}&gender=${gender}`
        )
        .then((res) => res.data),
  });

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = search || sort || minPrice || maxPrice || gender;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white pt-20 pb-8 md:pb-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full border border-amber-400/30">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span className="text-amber-400 text-sm font-medium tracking-wide">
                PREMIUM COLLECTION
              </span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-wide mb-4">
            <span className="bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
              Exquisite Jewelry
            </span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Discover our handcrafted collection of premium hallmarked jewelry.
            <span className="text-amber-400 font-medium">
              {" "}
              Each piece tells a story of elegance and tradition.
            </span>
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
              <span>Hallmarked Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
              <span>Authentic Designs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
              <span>Premium Craftsmanship</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-First Compact Filter Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Search Icon Button */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jewelry..."
                value={search}
                onChange={(e) =>
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    search: e.target.value,
                  })
                }
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Sort by Price
                  </label>
                  <select
                    value={sort}
                    onChange={(e) =>
                      setSearchParams({
                        ...Object.fromEntries(searchParams),
                        sort: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setSearchParams({
                        ...Object.fromEntries(searchParams),
                        minPrice: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setSearchParams({
                        ...Object.fromEntries(searchParams),
                        maxPrice: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) =>
                      setSearchParams({
                        ...Object.fromEntries(searchParams),
                        gender: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
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

      {/* Products Grid */}
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

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {isLoading && (
            <div className="col-span-full flex items-center justify-center py-16">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading jewelry...</span>
              </div>
            </div>
          )}
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          {products?.length === 0 && (
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
};

export default JewelryPage;
