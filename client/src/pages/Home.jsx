import { useState, useEffect, useMemo, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Award,
  Shield,
  Gem,
  Sparkles,
  Crown,
} from "lucide-react";
import toast from "react-hot-toast";
import Marquee from "../components/Marquee";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import SEOMetaTags from "../components/SEO/SEOMetaTags";
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateWebsiteSchema,
} from "../components/SEO/StructuredData";
import { SEO_TEMPLATES } from "../components/SEO/seoConfig";

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [currentCarousel, setCurrentCarousel] = useState(0);
  const navigate = useNavigate();

  // Context
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, user, fetchWishlistProducts } =
    useContext(AuthContext);

  // Array of video sources
  const videoSources = [
    "https://res.cloudinary.com/dvjzleula/video/upload/v1760197182/akk1_wa00br.mp4" ||
      "/assets/videos/akk1.mp4",
    "https://res.cloudinary.com/dvjzleula/video/upload/v1760197169/akk2_n8r7k6.mp4" ||
      "/assets/videos/akk2.mp4",
    "https://res.cloudinary.com/dvjzleula/video/upload/v1760197174/akk4_uuk1sl.mp4" ||
      "/assets/videos/akk3.mp4",
    "https://res.cloudinary.com/dvjzleula/video/upload/v1760197169/akk3_psbryx.mp4" ||
      "/assets/videos/akk4.mp4",
  ];

  // Change video every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videoSources.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [videoSources.length]);

  // Fetch categories (only Jewelry type, limited to 9)
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["jewelryCategories"],
    queryFn: () =>
      axios
        .get("/api/categories/type/Jewelry")
        .then((res) => res.data.slice(0, 9)),
  });

  // Fetch trending jewelry products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["jewelryProducts"],
    queryFn: () =>
      axios
        .get("/api/products?trending=true&type=Jewelry")
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  // Fetch carousel items
  const { data: carouselItems, isLoading: carouselLoading } = useQuery({
    queryKey: ["carousel"],
    queryFn: () => axios.get("/api/carousel").then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Fetch editorials
  const { data: editorials, isLoading: editorialsLoading } = useQuery({
    queryKey: ["editorials"],
    queryFn: () => axios.get("/api/editorials").then((res) => res.data.data),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Hero slides configuration
  const heroSlides = [
    {
      title: "Abhushan Kala Kendra – Trusted Gold & Silver Jewellery",
      subtitle:
        "Blending tradition with fine craftsmanship to create timeless jewellery and gifts.",
      cta: "Call +91-7295810660",
      action: () => window.open("tel:+917295810660", "_self"),
    },
    {
      title: "Hallmarked Jewellery & More",
      subtitle:
        "Founded by Anup Kumar Soni, offering hallmarked gold, silver, pots, marriage sets, and personalized gifts.",
      cta: "Explore Collection",
      action: () => navigate("/store"),
    },
    {
      title: "Wedding Collections",
      subtitle:
        "Bridal sets, pots, and essentials available on order with timely delivery.",
      cta: "Wedding Orders",
      action: () => navigate("/marriage-booking"),
    },
  ];

  // Handle auto-slide for hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Handle auto-slide for carousel
  useEffect(() => {
    if (carouselItems?.length) {
      const interval = setInterval(() => {
        setCurrentCarousel((prev) => (prev + 1) % carouselItems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [carouselItems?.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const nextCarousel = () => {
    setCurrentCarousel((prev) => (prev + 1) % carouselItems.length);
  };

  const prevCarousel = () => {
    setCurrentCarousel(
      (prev) => (prev - 1 + carouselItems.length) % carouselItems.length
    );
  };

  // Memoized Carousel
  const memoizedCarousel = useMemo(
    () => (
      <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 md:py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-purple-400 to-pink-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Crown className="w-3 h-3 text-amber-500" />
                Featured Collections
              </span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent via-gray-300 to-transparent"></div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-thin mb-6 tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              Curated Excellence
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Discover handpicked collections that embody timeless elegance and
              contemporary luxury
            </p>
          </div>

          {carouselLoading ? (
            <div className="relative">
              <div className="h-[600px] bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-2xl animate-pulse shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse rounded-2xl"></div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden min-h-[400px] md:min-h-[500px] lg:min-h-[600px] rounded-2xl shadow-2xl">
              {carouselItems?.map((item, index) => (
                <div
                  key={item._id}
                  className={`transition-all duration-[1500ms] ease-in-out flex items-center justify-between absolute top-0 left-0 w-full h-full transform ${
                    index === currentCarousel
                      ? "opacity-100 z-10 scale-100"
                      : "opacity-0 z-0 pointer-events-none scale-105"
                  }`}
                  style={{ minHeight: "inherit" }}
                >
                  <Link
                    to={item.link}
                    className="flex flex-col md:flex-row items-center gap-0 w-full h-full group rounded-2xl overflow-hidden bg-white shadow-xl"
                  >
                    {/* Image Section */}
                    <div className="w-full md:w-3/5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent z-10"></div>
                      <img
                        src={
                          item.image?.url ||
                          "/assets/images/fallback-carousel.jpg"
                        }
                        alt={item.title}
                        className="w-full h-[250px] sm:h-[350px] md:h-[500px] lg:h-[600px] object-cover transition-all duration-1000 group-hover:scale-110 filter brightness-95 group-hover:brightness-100"
                        onError={(e) => {
                          if (!e.target.src.includes("fallback-carousel.jpg")) {
                            e.target.src =
                              "/assets/images/fallback-carousel.jpg";
                          }
                        }}
                      />
                      {/* Floating Elements */}
                      <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <span className="text-xs font-semibold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          Premium
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-2/5 px-6 sm:px-8 md:px-12 lg:px-16 py-8 md:py-10 lg:py-12 relative bg-gradient-to-br from-white via-gray-50 to-white">
                      {/* Decorative Elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-100 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100 to-transparent rounded-full translate-y-12 -translate-x-12 opacity-60"></div>

                      {/* Featured Badge */}
                      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                        <div className="w-8 md:w-12 h-px bg-gradient-to-r from-amber-400 to-orange-500"></div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                          Featured
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-thin mb-4 md:mb-6 text-gray-900 leading-tight tracking-tight relative">
                        {item.title}
                        <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-6 md:mb-8 leading-relaxed font-light max-w-sm">
                        {item.description}
                      </p>

                      {/* CTA Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(item.link || "/store");
                        }}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-3 rounded-full text-xs md:text-sm font-medium uppercase tracking-wide hover:from-gray-800 hover:to-gray-700 transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:translate-x-2"
                      >
                        <span>Explore Collection</span>
                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
                      </button>

                      {/* Stats */}
                      <div className="hidden sm:block mt-8 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-base sm:text-lg md:text-xl font-light text-gray-900">
                              50+
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">
                              Pieces
                            </div>
                          </div>
                          <div>
                            <div className="text-base sm:text-lg md:text-xl font-light text-gray-900">
                              ★ 4.9
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">
                              Rating
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}

              {/* Enhanced Navigation Buttons */}
              <button
                onClick={prevCarousel}
                className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-white/95 backdrop-blur-md hover:bg-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 flex items-center justify-center border border-white/50 hover:border-gray-200 group hover:scale-110 cursor-pointer"
                style={{ top: "calc(50% - 20px)" }}
                aria-label="Previous Carousel Item"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700 transition-transform group-hover:-translate-x-0.5" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={nextCarousel}
                className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-white/95 backdrop-blur-md hover:bg-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 flex items-center justify-center border border-white/50 hover:border-gray-200 group hover:scale-110 cursor-pointer"
                style={{ top: "calc(50% - 20px)" }}
                aria-label="Next Carousel Item"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700 transition-transform group-hover:translate-x-0.5" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Enhanced Progress Indicators */}
              <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                {carouselItems?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCarousel(index)}
                    className={`relative overflow-hidden rounded-full transition-all duration-500 cursor-pointer ${
                      index === currentCarousel
                        ? "w-10 h-2.5 md:w-12 md:h-3 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg"
                        : "w-2.5 h-2.5 md:w-3 md:h-3 bg-white/60 hover:bg-white/80 shadow-md hover:scale-125"
                    }`}
                    aria-label={`Go to carousel item ${index + 1}`}
                  >
                    {index === currentCarousel && (
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-orange-400 animate-pulse rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Auto-play Progress Bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200/50 z-20">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                  style={{
                    animation: "progress 5s linear infinite",
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    [carouselItems, currentCarousel, carouselLoading, navigate]
  );

  // Combined structured data for home page
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      generateOrganizationSchema(),
      generateLocalBusinessSchema(),
      generateWebsiteSchema(),
    ],
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEOMetaTags
        title={SEO_TEMPLATES.home.title}
        description={SEO_TEMPLATES.home.description}
        keywords={SEO_TEMPLATES.home.keywords}
        canonicalUrl="https://abhushankalakendra.vercel.app/"
        structuredData={homeStructuredData}
        ogImage="https://abhushankalakendra.vercel.app/assets/images/home-og.jpg"
      />
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
                
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
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
                
                @keyframes progress {
                    0% {
                        width: 0%;
                    }
                    100% {
                        width: 100%;
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                
                @keyframes glow {
                    0%, 100% {
                        box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
                    }
                    50% {
                        box-shadow: 0 0 30px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.4);
                    }
                }
                
                .hero-text {
                    animation: fadeInUp 1.2s ease-out 0.5s both;
                }
                
                .hero-subtitle {
                    animation: fadeInUp 1.2s ease-out 0.7s both;
                }
                
                .hero-cta {
                    animation: fadeInUp 1.2s ease-out 0.9s both;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
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
                
                .float-animation {
                    animation: float 6s ease-in-out infinite;
                }
                
                .glow-effect {
                    animation: glow 2s ease-in-out infinite alternate;
                }
                
                .carousel-slide {
                    backdrop-filter: blur(10px);
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%);
                }
                
                .gradient-text {
                    background: linear-gradient(135deg, #1f2937 0%, #4b5563 50%, #1f2937 100%);
                    background-size: 200% 200%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: gradientShift 3s ease infinite;
                }
                
                @keyframes gradientShift {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
            `}</style>

      {/* HERO SECTION */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            key={videoSources[currentVideo]}
          >
            <source src={videoSources[currentVideo]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10"></div>

        <div className="relative z-30 h-full flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-8">
            <div className="flex items-center justify-center gap-4 mb-8 hero-text">
              <div className="w-12 h-px bg-white/60"></div>
              <span className="text-xs font-medium text-white/90 uppercase tracking-[0.3em]">
                Premium Jewelry
              </span>
              <div className="w-12 h-px bg-white/60"></div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-thin mb-6 tracking-tight text-white leading-tight hero-text">
              {heroSlides[currentSlide].title}
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 font-light leading-relaxed max-w-2xl mx-auto hero-subtitle">
              {heroSlides[currentSlide].subtitle}
            </p>

            <button
              onClick={heroSlides[currentSlide].action}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-6 py-3 text-xs md:text-sm font-medium uppercase tracking-wide border border-white/20 hover:bg-white/20 transition-all duration-500 hover:tracking-wider hero-cta cursor-pointer"
            >
              <span>{heroSlides[currentSlide].cta}</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-300 flex items-center justify-center border border-white/20 cursor-pointer"
          style={{ top: "calc(50% - 40px)" }}
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-300 flex items-center justify-center border border-white/20 cursor-pointer"
          style={{ top: "calc(50% - 40px)" }}
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-50 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/70 w-2"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <Marquee />

      {/* Categories Section */}
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-gray-50 py-8 md:py-16 overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-200 via-orange-200 to-yellow-200 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-purple-200 via-pink-200 to-rose-200 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 transform rotate-45">
            <div className="grid grid-cols-8 gap-4">
              {[...Array(64)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Enhanced Section Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              <div className="flex items-center gap-2 md:gap-3 bg-white/80 backdrop-blur-lg px-4 md:px-6 py-2 md:py-3 rounded-full shadow-xl border border-amber-100">
                <Gem className="w-3 md:w-4 h-3 md:h-4 text-amber-600" />
                <span className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-[0.2em] md:tracking-[0.3em]">
                  Premium Collections
                </span>
                <Sparkles className="w-3 md:w-4 h-3 md:h-4 text-amber-600" />
              </div>
              <div className="w-20 h-px bg-gradient-to-l from-transparent via-amber-400 to-transparent"></div>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 tracking-tight text-gray-800 leading-tight">
              Premium Collections
            </h2>

            <div className="max-w-2xl mx-auto">
              <p className="text-sm md:text-base text-gray-500 leading-relaxed font-light">
                Discover our curated selection of fine jewelry and gifts
              </p>
            </div>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 animate-pulse h-[500px] rounded-2xl shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse rounded-2xl shimmer-effect"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories?.map((category, index) => (
                <Link
                  to={`/category/${category._id}`}
                  key={category._id}
                  className="relative overflow-hidden rounded-2xl shadow-2xl active:scale-95 transition-transform duration-200"
                  style={{
                    animation: `fadeInUp 1s ease-out ${index * 0.15}s both`,
                  }}
                >
                  {/* Premium Card Container */}
                  <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl border border-amber-100">
                    {/* Luxury Badge - Always Visible */}
                    <div className="absolute top-4 left-4 z-30">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl">
                        <Crown className="w-3 h-3" />
                        <span>Luxury</span>
                      </div>
                    </div>

                    {/* Premium Status Indicator - Always Visible */}
                    <div className="absolute top-4 right-4 z-30">
                      <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-amber-100">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span className="text-xs font-semibold text-gray-800">
                          Premium
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Image Section */}
                    <div className="relative overflow-hidden h-64 sm:h-72">
                      <img
                        src={
                          category.image?.url ||
                          "/assets/images/noise_ring.jpeg"
                        }
                        alt={category.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (!e.target.src.includes("fallback-category.jpg")) {
                            e.target.src =
                              "/assets/images/fallback-category.jpg";
                          }
                        }}
                      />

                      {/* Elegant Gradient Overlay - Always Visible */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-transparent to-purple-500/15"></div>

                      {/* Subtle Sparkle Effects - Always Visible */}
                      <div
                        className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0s" }}
                      ></div>
                      <div
                        className="absolute top-3/4 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{ animationDelay: "1s" }}
                      ></div>
                      <div
                        className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse"
                        style={{ animationDelay: "2s" }}
                      ></div>
                    </div>

                    {/* Premium Content Section - Mobile Optimized */}
                    <div className="p-6">
                      {/* Category Title */}
                      <div className="mb-4">
                        <h3 className="text-2xl sm:text-3xl font-light text-gray-900 tracking-wide mb-2">
                          {category.name}
                        </h3>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed font-light mb-6">
                        {category.description}
                      </p>

                      {/* Premium Features - Always Visible */}
                      <div className="mb-6">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-green-500" />
                            <span>Certified</span>
                          </div>
                          <div className="w-px h-3 bg-gray-300"></div>
                          <div className="flex items-center gap-1">
                            <Award className="w-3 h-3 text-blue-500" />
                            <span>Handcrafted</span>
                          </div>
                          <div className="w-px h-3 bg-gray-300"></div>
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-500" />
                            <span>Premium</span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Footer */}
                      <div className="flex items-center justify-between">
                        {/* Premium Stats */}
                        <div className="flex items-center gap-3">
                          {category.productCount && (
                            <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-full">
                              <Gem className="w-3 h-3 text-amber-600" />
                              <span className="text-xs font-semibold text-amber-800">
                                {category.productCount} pieces
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-500">
                              Premium
                            </span>
                          </div>
                        </div>

                        {/* CTA Button - Always Visible */}
                        <div className="flex items-center gap-2 text-gray-900 text-sm font-semibold">
                          <span className="hidden sm:block">Explore</span>
                          <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                            <ChevronRight className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subtle Glow Effect - Always Visible */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/5 via-transparent to-orange-400/5"></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trending Products Section */}
      <div className="bg-white py-8 md:py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-4 mb-4 md:mb-6">
              <div className="w-12 h-px bg-gray-300"></div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-[0.2em]">
                Trending
              </span>
              <div className="w-12 h-px bg-gray-300"></div>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-3 md:mb-4 tracking-tight text-gray-800">
              Trending Jewelry
            </h2>
            <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed font-light">
              Discover our most coveted pieces
            </p>
          </div>

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
          ) : (
            <>
              <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {products?.map((product, index) => (
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

              {/* View All Products Button */}
              <div className="text-center mt-8 md:mt-12">
                <button
                  onClick={() => navigate("/store")}
                  className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-sm md:text-base font-medium hover:from-gray-800 hover:to-gray-700 transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                >
                  <span>View All Products</span>
                  <ChevronRight className="w-4 md:w-5 h-4 md:h-5 transition-transform group-hover:translate-x-1" />
                </button>
                <p className="text-gray-500 text-xs md:text-sm mt-2 md:mt-3">
                  Discover our complete jewelry collection
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Carousel Section */}
      {memoizedCarousel}

      {/* Editorials Section */}
      <div className="bg-white py-8 md:py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-4 mb-4 md:mb-6">
              <div className="w-12 h-px bg-gray-300"></div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-[0.2em]">
                Stories
              </span>
              <div className="w-12 h-px bg-gray-300"></div>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-3 md:mb-4 tracking-tight text-gray-800">
              Our Stories
            </h2>
            <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed font-light">
              Curated jewelry narratives
            </p>
          </div>

          {editorialsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-xl shadow-lg animate-pulse"
                >
                  <div className="h-96 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="h-6 bg-white/20 rounded mb-3"></div>
                    <div className="h-4 bg-white/20 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : editorials?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {editorials.map((editorial, index) => (
                <Link
                  to={editorial.link}
                  key={editorial._id}
                  className="group relative overflow-hidden hover:shadow-2xl transition-all duration-700 rounded-xl"
                  style={{
                    animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={
                        editorial.image?.url ||
                        "/assets/images/fallback-editorial.jpg"
                      }
                      alt={editorial.title}
                      className="w-full h-96 object-cover transition-all duration-1000 group-hover:scale-105 filter grayscale-[10%] group-hover:grayscale-0"
                      onError={(e) => {
                        if (!e.target.src.includes("fallback-editorial.jpg")) {
                          e.target.src =
                            "/assets/images/fallback-editorial.jpg";
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-2xl font-light text-white mb-3 tracking-wide">
                      {editorial.title}
                    </h3>
                    <p className="text-gray-200 text-sm mb-4 leading-relaxed font-light opacity-90">
                      {editorial.description}
                    </p>
                    <div className="flex items-center gap-2 text-white text-sm font-medium uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span>Read Story</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Stories Available
              </h3>
              <p className="text-gray-600">
                Check back soon for our latest editorial content
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Store CTA Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 md:py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-purple-400 to-pink-400 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            <span className="text-xs font-medium text-amber-400 uppercase tracking-[0.3em]">
              Premium Shopping
            </span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent via-amber-400 to-transparent"></div>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6 tracking-tight text-white leading-tight">
            Your Wedding Dreams Await
          </h2>

          <p className="text-sm md:text-base text-gray-300 mb-6 md:mb-8 leading-relaxed font-light max-w-xl mx-auto">
            Certified jewelry for your special moments
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <button
              onClick={() => navigate("/store")}
              className="inline-flex items-center gap-3 md:gap-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-medium hover:from-amber-400 hover:to-orange-400 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:translate-y-[-2px] cursor-pointer"
            >
              <span>Visit Store</span>
              <ChevronRight className="w-4 md:w-5 h-4 md:h-5 transition-transform group-hover:translate-x-1" />
            </button>

            <div className="flex items-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Hallmarked Purity</span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Quality Guarantee</span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Wedding Orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-8 md:py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12 md:mb-20">
            <div className="flex justify-center mb-6">
              <img
                src="https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png"
                alt="Abhushan Kala Kendra Logo"
                className="h-20 w-20 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
              />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-thin mb-6 tracking-tight text-gray-900">
              Why Choose Abhushan Kala Kendra
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              Every piece comes with our promise of authenticity and quality, so
              you wear not just jewellery but confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                icon: Gem,
                title: "Hallmarked Purity",
                description:
                  "Hallmarked gold & silver jewellery — certified purity and lasting shine with trusted quality assurance",
              },
              {
                icon: Award,
                title: "Skilled Artisans",
                description:
                  "Skilled artisans creating bespoke designs with traditional craftsmanship and modern elegance",
              },
              {
                icon: Shield,
                title: "Quality Guarantee",
                description:
                  "All pieces carry our assurance of craftsmanship and material authenticity with transparent pricing",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center group"
                style={{
                  animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`,
                }}
              >
                <div className="mb-8">
                  <div className="w-16 h-16 mx-auto bg-white border border-gray-200 rounded-full flex items-center justify-center group-hover:border-gray-300 transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-gray-700" />
                  </div>
                </div>
                <h3 className="text-xl font-light mb-4 text-gray-900 tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
