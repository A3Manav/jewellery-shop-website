import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import SEOMetaTags from "../components/SEO/SEOMetaTags";
import {
  generateProductSchema,
  generateBreadcrumbSchema,
} from "../components/SEO/StructuredData";
import { SEO_TEMPLATES } from "../components/SEO/seoConfig";
import {
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Package,
  Shield,
  Award,
  Truck,
  RefreshCw,
  MessageCircle,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  ArrowLeft,
  Plus,
  Minus,
  Eye,
  Camera,
  Sparkles,
  Crown,
  Gem,
  Verified,
} from "lucide-react";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user, addToWishlist, isInWishlist } = useContext(AuthContext);

  // State management
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [activeTab, setActiveTab] = useState("details");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => axios.get(`/api/products/${id}`).then((res) => res.data),
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch similar products from the same category
  const { data: similarProducts } = useQuery({
    queryKey: ["similar-products", product?.category?._id, id],
    queryFn: () =>
      axios
        .get(`/api/products?category=${product.category._id}&limit=8`)
        .then((res) => res.data.filter((p) => p._id !== id)),
    enabled: !!product?.category?._id,
    staleTime: 5 * 60 * 1000,
  });

  // Reset loading states when product or user changes
  useEffect(() => {
    setLoadingStates({});
  }, [product?._id, user?.wishlist]);

  // Mobile-First Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header Skeleton */}
        <div className="bg-black text-white pt-20 pb-4 md:pb-6">
          <div className="container mx-auto px-4">
            <div className="h-4 bg-gray-600 rounded w-2/3 mb-4 animate-pulse"></div>
            <div className="text-center">
              <div className="h-6 bg-gray-600 rounded w-1/3 mx-auto mb-2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            <div className="space-y-4">
              <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/store")}
            className="px-6 py-3 bg-amber-500 text-black rounded-xl hover:bg-amber-400 transition-colors font-medium"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Helper functions
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setLoadingStates((prev) => ({ ...prev, cart: true }));
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      toast.success(`${product.title} (${quantity}) added to cart!`, {
        duration: 3000,
        style: { background: "#10B981", color: "white" },
      });
      setLoadingStates((prev) => ({ ...prev, cart: "success" }));
      setTimeout(
        () => setLoadingStates((prev) => ({ ...prev, cart: false })),
        1000
      );
    } catch (error) {
      toast.error("Failed to add to cart");
      setLoadingStates((prev) => ({ ...prev, cart: false }));
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, wishlist: true }));
    try {
      await addToWishlist(product._id);
      setLoadingStates((prev) => ({ ...prev, wishlist: "success" }));
      setTimeout(
        () => setLoadingStates((prev) => ({ ...prev, wishlist: false })),
        1000
      );
    } catch (error) {
      setLoadingStates((prev) => ({ ...prev, wishlist: false }));
    }
  };

  const shareToWhatsApp = () => {
    const message = `Check out this amazing product: *${
      product.title
    }*\n\nPrice: ₹${product.price?.toLocaleString()}\n${
      product.description
    }\n\nView details: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setShowShareMenu(false);
    toast.success("Sharing to WhatsApp!");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
      setShowShareMenu(false);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const shareToSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Check out ${product.title} - ₹${product.price?.toLocaleString()}`
    );

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
      setShowShareMenu(false);
    }
  };

  const calculateDiscountedPrice = () => {
    if (!product.price || !product.discount) return product.price;
    return product.price - (product.price * product.discount) / 100;
  };

  // Check if user can write a review
  const checkCanReview = async () => {
    if (!user || !product._id) return false;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `/api/reviews/can-review/${product._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.canReview;
    } catch (error) {
      console.error("Check can review error:", error);
      return false;
    }
  };

  const handleReviewFormToggle = async () => {
    if (!user) {
      toast.error("Please login to write a review");
      return;
    }

    const canReview = await checkCanReview();
    if (!canReview) {
      toast.error("You have already reviewed this product");
      return;
    }

    setShowReviewForm(true);
  };

  const discountedPrice = calculateDiscountedPrice();

  // SEO data for product page
  const productSEO = product
    ? {
        title: SEO_TEMPLATES.product(
          product.name,
          product.category?.name || product.type,
          discountedPrice
        ).title,
        description: SEO_TEMPLATES.product(
          product.name,
          product.category?.name || product.type,
          discountedPrice
        ).description,
        keywords: SEO_TEMPLATES.product(
          product.name,
          product.category?.name || product.type,
          discountedPrice
        ).keywords,
        canonicalUrl: `https://abhushankalakendra.vercel.app/product/${product._id}`,
        ogImage:
          product.images?.[0] ||
          "https://abhushankalakendra.vercel.app/assets/images/default-product.jpg",
      }
    : null;

  // Breadcrumb schema
  const breadcrumbs = product
    ? [
        { name: "Home", url: "https://abhushankalakendra.vercel.app/" },
        { name: "Store", url: "https://abhushankalakendra.vercel.app/store" },
        {
          name: product.category?.name || product.type,
          url: `https://abhushankalakendra.vercel.app/store?category=${
            product.category?._id || product.type
          }`,
        },
        {
          name: product.name,
          url: `https://abhushankalakendra.vercel.app/product/${product._id}`,
        },
      ]
    : [];

  const combinedStructuredData = product
    ? {
        "@context": "https://schema.org",
        "@graph": [
          generateProductSchema(product),
          generateBreadcrumbSchema(breadcrumbs),
        ],
      }
    : null;

  return (
    <div className="min-h-screen bg-white">
      {product && productSEO && (
        <SEOMetaTags
          title={productSEO.title}
          description={productSEO.description}
          keywords={productSEO.keywords}
          canonicalUrl={productSEO.canonicalUrl}
          ogImage={productSEO.ogImage}
          ogType="product"
          structuredData={combinedStructuredData}
        />
      )}
      {/* Premium Mobile-First Header */}
      <div className="bg-black text-white pt-20 pb-4 md:pb-6">
        <div className="container mx-auto px-4">
          {/* Simple Back Button */}
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>

          {/* Premium Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-400/30 mb-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span className="text-amber-400 text-xs font-medium tracking-wide uppercase">
                {product.type || "Premium Product"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Mobile-First Image Gallery */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg bg-gray-50">
                <img
                  src={
                    product.images?.[selectedImage]?.url ||
                    "/assets/images/chudi.jpeg"
                  }
                  alt={product.title}
                  className={`w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover transition-all duration-700 ${
                    isZoomed
                      ? "scale-150 cursor-zoom-out"
                      : "cursor-zoom-in hover:scale-105"
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                  onError={(e) => {
                    if (!e.target.src.includes("chudi.jpeg")) {
                      e.target.src = "/assets/images/chudi.jpeg";
                    }
                  }}
                />

                {/* Mobile Navigation Dots */}
                {product.images?.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 sm:hidden">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          selectedImage === index ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Desktop Navigation Arrows */}
                {product.images?.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === 0 ? product.images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 items-center justify-center opacity-0 group-hover:opacity-100 hidden sm:flex"
                    >
                      <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === product.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 items-center justify-center opacity-0 group-hover:opacity-100 hidden sm:flex"
                    >
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Zoom Icon */}
                <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                </div>

                {/* Premium Product Badge */}
                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                  <span className="px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium uppercase tracking-wide backdrop-blur-sm shadow-lg bg-black/80 text-white">
                    {product.type}
                  </span>
                </div>

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-3 right-3 md:top-4 md:right-16">
                    <span className="px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold bg-amber-500 text-black">
                      -{product.discount}%
                    </span>
                  </div>
                )}
              </div>

              {/* Mobile-First Thumbnail Gallery */}
              {product.images?.length > 1 && (
                <div className="flex gap-2 md:gap-3 overflow-x-auto py-2 scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 relative overflow-hidden rounded-lg transition-all duration-300 ${
                        selectedImage === index
                          ? "ring-2 ring-amber-400 shadow-lg scale-105"
                          : "hover:scale-105 hover:shadow-md ring-1 ring-gray-200"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.title} ${index + 1}`}
                        className="w-16 h-16 md:w-20 md:h-20 object-cover"
                        onError={(e) => {
                          if (!e.target.src.includes("chudi.jpeg")) {
                            e.target.src = "/assets/images/chudi.jpeg";
                          }
                        }}
                      />
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-amber-400/10"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Premium Product Details */}
          <div className="space-y-6 lg:space-y-8">
            {/* Header Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {product.hallmarked && (
                    <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium border border-amber-200">
                      <Verified className="w-3 h-3" />
                      <span className="hidden sm:inline">Certified</span>
                    </span>
                  )}
                  {product.type && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {product.type}
                    </span>
                  )}
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-900 mb-4 leading-tight">
                {product.title}
              </h1>

              {/* Rating Display */}
              {product.totalReviews > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 md:w-5 md:h-5 ${
                          i < Math.floor(product.averageRating)
                            ? "text-amber-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.averageRating?.toFixed(1)}) •{" "}
                      {product.totalReviews} Review
                      {product.totalReviews !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Premium Pricing Section */}
            <div className="bg-gray-50 rounded-xl p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-3">
                {product.discount > 0 ? (
                  <>
                    <span className="text-3xl md:text-4xl font-light text-gray-900">
                      ₹{discountedPrice?.toLocaleString()}
                    </span>
                    <span className="text-xl md:text-2xl text-gray-500 line-through">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    <span className="bg-amber-400 text-black px-2 py-1 rounded-full text-sm font-bold">
                      Save {product.discount}%
                    </span>
                  </>
                ) : (
                  <span className="text-3xl md:text-4xl font-light text-gray-900">
                    ₹{product.price?.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm">
                Inclusive of all taxes • Free shipping available
              </p>

              {/* Savings Highlight */}
              {product.discount > 0 && (
                <div className="mt-3 inline-flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    You save ₹
                    {(product.price - discountedPrice)?.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Mobile-First Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToWishlist}
                disabled={loadingStates.wishlist}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                  loadingStates.wishlist === "success"
                    ? "bg-amber-50 border-amber-300 text-amber-700"
                    : isInWishlist(product._id)
                    ? "bg-amber-50 border-amber-300 text-amber-700"
                    : "border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50"
                }`}
              >
                {loadingStates.wishlist === "success" ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Heart
                    className={`w-5 h-5 ${
                      isInWishlist(product._id) ? "fill-current" : ""
                    }`}
                  />
                )}
                <span className="text-sm font-medium hidden sm:inline">
                  {loadingStates.wishlist === "success" ? "Added!" : "Wishlist"}
                </span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50 transition-all duration-300"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:inline">
                    Share
                  </span>
                </button>

                {/* Enhanced Mobile-First Share Menu */}
                {showShareMenu && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 w-80 max-w-[90vw]">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Share this product
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={shareToWhatsApp}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50 text-gray-600 hover:text-amber-700 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">WhatsApp</span>
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50 text-gray-600 hover:text-amber-700 transition-colors"
                      >
                        <Copy className="w-5 h-5" />
                        <span className="text-sm font-medium">Copy Link</span>
                      </button>
                      <button
                        onClick={() => shareToSocial("facebook")}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50 text-gray-600 hover:text-amber-700 transition-colors"
                      >
                        <Facebook className="w-5 h-5" />
                        <span className="text-sm font-medium">Facebook</span>
                      </button>
                      <button
                        onClick={() => shareToSocial("twitter")}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50 text-gray-600 hover:text-amber-700 transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                        <span className="text-sm font-medium">Twitter</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Premium Quantity Selector */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quantity
              </label>
              <div className="flex items-center justify-between">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 text-gray-900 font-semibold bg-gray-50 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">Max 10 items</span>
              </div>
            </div>

            {/* Premium Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={loadingStates.cart}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  loadingStates.cart === "success"
                    ? "bg-black text-white"
                    : "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl active:scale-[0.98]"
                }`}
              >
                {loadingStates.cart === "success" ? (
                  <Check className="w-6 h-6" />
                ) : loadingStates.cart ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ShoppingCart className="w-6 h-6" />
                )}
                <span>
                  {loadingStates.cart === "success"
                    ? "Added to Cart!"
                    : loadingStates.cart
                    ? "Adding..."
                    : "Add to Cart"}
                </span>
              </button>

              <button
                onClick={() => {
                  handleAddToCart();
                  setTimeout(() => navigate("/checkout"), 1000);
                }}
                className="w-full py-4 rounded-xl font-semibold text-lg border-2 border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-black transition-all duration-300 active:scale-[0.98]"
              >
                Buy Now
              </button>
            </div>

            {/* Premium Product Info Grid */}
            <div className="bg-gradient-to-r from-gray-50 to-amber-50/30 rounded-xl p-4 md:p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                Product Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <Package className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <div>
                    <span className="text-gray-500 block">SKU</span>
                    <span className="font-medium text-gray-900">
                      {product.productId || product._id?.slice(-8)}
                    </span>
                  </div>
                </div>
                {product.weight && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500 block">Weight</span>
                      <span className="font-medium text-gray-900">
                        {product.weight}g
                      </span>
                    </div>
                  </div>
                )}
                {product.category && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <Gem className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500 block">Category</span>
                      <span className="font-medium text-gray-900">
                        {product.category.name}
                      </span>
                    </div>
                  </div>
                )}
                {product.type && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500 block">Type</span>
                      <span className="font-medium text-gray-900">
                        {product.type}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Premium Tabs Section */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                {["details", "specifications", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-4 text-sm font-medium capitalize transition-all ${
                      activeTab === tab
                        ? "text-amber-600 bg-white border-b-2 border-amber-400 -mb-px"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-4 md:p-6 min-h-[250px]">
                {activeTab === "details" && (
                  <div className="max-w-none">
                    <div className="text-gray-700 leading-relaxed text-sm md:text-base lg:text-lg">
                      <h4 className="font-semibold text-gray-900 mb-4 text-lg md:text-xl flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        Product Description
                      </h4>
                      <div className="bg-gradient-to-r from-gray-50 to-amber-50/30 p-4 md:p-6 rounded-xl border border-gray-200">
                        <p className="text-gray-700 leading-relaxed text-sm md:text-base lg:text-lg whitespace-pre-line">
                          {product.description ||
                            "No description available for this product."}
                        </p>
                      </div>

                      {/* Additional product highlights for details tab */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <Crown className="w-4 h-4 text-amber-500" />
                            Quality Assurance
                          </h5>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {product.hallmarked
                              ? "Certified hallmarked jewelry with quality guarantee."
                              : "Premium quality product with rigorous quality checks."}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <Gem className="w-4 h-4 text-amber-500" />
                            Care Instructions
                          </h5>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Store in a dry place, clean with soft cloth, and
                            avoid contact with chemicals for longevity.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "specifications" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-gray-50 to-amber-50/30 p-6 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-500" />
                          General Information
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center p-2 rounded">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium">{product.type}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 rounded">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium">
                              {product.category?.name}
                            </span>
                          </div>
                          {product.weight && (
                            <div className="flex justify-between items-center p-2 rounded">
                              <span className="text-gray-600">Weight:</span>
                              <span className="font-medium">
                                {product.weight}g
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {product.attributes && (
                        <div className="bg-gradient-to-br from-gray-50 to-amber-50/30 p-6 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Gem className="w-4 h-4 text-amber-500" />
                            Product Attributes
                          </h4>
                          <div className="space-y-3 text-sm">
                            {Object.entries(product.attributes).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="flex justify-between items-center p-2 rounded"
                                >
                                  <span className="text-gray-600 capitalize">
                                    {key}:
                                  </span>
                                  <span className="font-medium">{value}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    {/* Write Review Section */}
                    {user && !showReviewForm && (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            Share Your Experience
                          </h4>
                          <p className="text-sm text-gray-600">
                            Help others by writing a review
                          </p>
                        </div>
                        <button
                          onClick={handleReviewFormToggle}
                          className="px-6 py-3 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors font-medium flex items-center gap-2"
                        >
                          <Star className="w-4 h-4" />
                          Write Review
                        </button>
                      </div>
                    )}

                    {/* Review Form */}
                    {showReviewForm && (
                      <div className="border border-amber-200 rounded-lg overflow-hidden">
                        <ReviewForm
                          productId={product._id}
                          onReviewSubmitted={(newReview) => {
                            setReviewRefreshTrigger((prev) => prev + 1);
                            setShowReviewForm(false);
                          }}
                          onClose={() => setShowReviewForm(false)}
                        />
                      </div>
                    )}

                    {/* Review List */}
                    <ReviewList
                      productId={product._id}
                      refreshTrigger={reviewRefreshTrigger}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts && similarProducts.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-amber-50/30 py-8 mt-12 rounded-2xl border border-gray-100">
            <div className="container mx-auto px-4">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-400/30 mb-3">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                  <span className="text-amber-600 text-xs font-medium tracking-wide uppercase">
                    Similar Products
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-2">
                  More from{" "}
                  <span className="text-amber-600 font-medium">
                    {product.category?.name}
                  </span>
                </h3>
                <p className="text-gray-600 text-sm">
                  Explore similar products you might like
                </p>
              </div>

              {/* Mobile-First Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {similarProducts.slice(0, 8).map((similarProduct) => (
                  <Link
                    key={similarProduct._id}
                    to={`/product/${similarProduct._id}`}
                    className="group bg-white rounded-lg border border-gray-200 hover:border-amber-300 transition-all duration-300 hover:shadow-lg overflow-hidden"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={
                          similarProduct.images?.[0]?.url ||
                          "/assets/images/chudi.jpeg"
                        }
                        alt={similarProduct.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          if (!e.target.src.includes("chudi.jpeg")) {
                            e.target.src = "/assets/images/chudi.jpeg";
                          }
                        }}
                      />
                      {similarProduct.discount > 0 && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                            -{similarProduct.discount}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4
                        className="font-medium text-gray-900 text-sm mb-1 overflow-hidden group-hover:text-amber-600 transition-colors"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          lineHeight: "1.3em",
                          maxHeight: "2.6em",
                        }}
                      >
                        {similarProduct.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        {similarProduct.discount > 0 ? (
                          <>
                            <span className="text-amber-600 font-semibold text-sm">
                              ₹
                              {(
                                similarProduct.price -
                                (similarProduct.price *
                                  similarProduct.discount) /
                                  100
                              ).toLocaleString()}
                            </span>
                            <span className="text-gray-400 line-through text-xs">
                              ₹{similarProduct.price?.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-amber-600 font-semibold text-sm">
                            ₹{similarProduct.price?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center mt-6">
                <Link
                  to={`/category/${product.category?._id}`}
                  className="inline-flex items-center px-6 py-3 bg-amber-500 text-black font-medium rounded-xl hover:bg-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All {product.category?.name}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Close share menu when clicking outside */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}

export default ProductDetails;
