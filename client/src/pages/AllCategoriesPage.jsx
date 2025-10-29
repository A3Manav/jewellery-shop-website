import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { LayoutGrid, Tag, Sparkles, ShoppingBag } from "lucide-react";

const categoryFilters = [
  { name: "All", type: "" },
  { name: "Jewelry", type: "Jewelry" },
  { name: "Pot Items", type: "Pot Items" },
  { name: "Gift Items", type: "Gift Items" },
  { name: "Custom Printed", type: "Custom Printed Products" },
];

const CategoryCard = ({ category }) => (
  <Link
    to={`/category/${category._id}`}
    className="group block bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
  >
    <div className="relative h-56 sm:h-64">
      <img
        src={category.image?.url || "/assets/images/fallback-category.jpg"}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          if (!e.target.src.includes("fallback-category.jpg")) {
            e.target.src = "/assets/images/fallback-category.jpg";
          }
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 sm:p-6">
        <h3 className="text-white text-lg sm:text-xl font-bold tracking-tight">
          {category.name}
        </h3>
        <span className="inline-flex items-center px-3 py-1 mt-2 text-xs font-medium text-white bg-white/20 backdrop-blur-sm rounded-full">
          {category.type}
        </span>
      </div>
    </div>
  </Link>
);

function AllCategoriesPage() {
  const [activeFilter, setActiveFilter] = useState("");
  const [currentVideo, setCurrentVideo] = useState(0);

  const videoSources = [
    "https://res.cloudinary.com/dvjzleula/video/upload/v1760262794/219228_bdcags.mp4",
    "https://res.cloudinary.com/dvjzleula/video/upload/v1760262792/157657-815175893_medium_lcmcrw.mp4",
    "https://res.cloudinary.com/dvjzleula/video/upload/v1760263096/55744-503980978_olwomh.mp4",
    "https://res.cloudinary.com/dvjzleula/video/upload/v1760262793/136134-764371502_medium_keplse.mp4",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videoSources.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [videoSources.length]);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["allCategories", activeFilter],
    queryFn: () =>
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/categories${
            activeFilter ? `?type=${activeFilter}` : ""
          }`
        )
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <>
      <Helmet>
        <title>Explore All Categories - Abhushan Kala Kendra</title>
        <meta
          name="description"
          content="Browse all product categories at Abhushan Kala Kendra. Filter by Jewelry, Pot Items, Gift Items, and Custom Printed Products to find exactly what you're looking for."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <div className="relative h-[50vh] md:h-[60vh] bg-gray-900 overflow-hidden text-white flex items-center justify-center text-center">
          <video
            key={videoSources[currentVideo]}
            className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2 z-0 transition-opacity duration-1000"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={videoSources[currentVideo]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div className="relative z-20 px-4 animate-fade-in-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <LayoutGrid className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Explore Our Categories
              </h1>
            </div>
            <p className="mt-4 text-base sm:text-lg text-gray-200 max-w-2xl mx-auto">
              Discover the perfect item from our diverse collections. Use the
              filters below to narrow down your search.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center justify-center space-x-2 sm:space-x-4 overflow-x-auto">
              {categoryFilters.map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => setActiveFilter(filter.type)}
                  className={`px-1 md:px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 whitespace-nowrap ${
                    activeFilter === filter.type
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <main className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-lg h-64 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {categories.map((category) => (
                  <CategoryCard key={category._id} category={category} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Tag className="w-16 h-16 mx-auto text-gray-300" />
                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                  No Categories Found
                </h3>
                <p className="mt-2 text-gray-500">
                  There are no categories matching the selected filter.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default AllCategoriesPage;
