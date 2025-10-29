import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import { Heart, Share, ShoppingCart, Sparkles, Check } from "lucide-react";
import toast from "react-hot-toast";

function ProductCard({
  product,
  showAddToCart = true,
  showShareButton = true,
  fromProfile = false, // New prop to indicate if called from profile page
  className = "",
}) {
  const { addToCart } = useContext(CartContext);
  const {
    user,
    addToWishlist,
    removeFromWishlistProfile,
    isInWishlist: checkIsInWishlist,
  } = useContext(AuthContext);
  const [loadingStates, setLoadingStates] = useState({});

  const shareWhatsApp = () => {
    const url = `${window.location.origin}/product/${product._id}`;
    window.open(
      `https://api.whatsapp.com/send?text=Check out this product: ${product.title} - ${url}`
    );
  };

  // Handle wishlist toggle (add everywhere, remove only from profile)
  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login to add items to wishlist", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#F59E0B",
          color: "white",
          fontWeight: "500",
          borderRadius: "12px",
          padding: "12px 16px",
        },
        icon: "⚠️",
      });
      return;
    }

    const isInWishlist = checkIsInWishlist(product._id);

    if (isInWishlist && !fromProfile) {
      // Don't allow removal from product cards - redirect to profile
      toast("Visit your profile to manage wishlist items", {
        icon: "ℹ️",
        duration: 3000,
        position: "top-right",
        style: {
          background: "#3B82F6",
          color: "white",
          fontWeight: "500",
          borderRadius: "12px",
          padding: "12px 16px",
        },
      });
      return;
    }

    if (isInWishlist && fromProfile) {
      // Allow removal from profile page
      setLoadingStates((prev) => ({
        ...prev,
        [`wishlist_${product._id}`]: "remove",
      }));

      try {
        const result = await removeFromWishlistProfile(product._id, true);

        if (result.success) {
          setLoadingStates((prev) => ({
            ...prev,
            [`wishlist_${product._id}`]: "success",
          }));
          setTimeout(() => {
            setLoadingStates((prev) => ({
              ...prev,
              [`wishlist_${product._id}`]: null,
            }));
          }, 1500);
        } else {
          setLoadingStates((prev) => ({
            ...prev,
            [`wishlist_${product._id}`]: null,
          }));
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        setLoadingStates((prev) => ({
          ...prev,
          [`wishlist_${product._id}`]: null,
        }));
      }
      return;
    }

    // Add to wishlist
    setLoadingStates((prev) => ({
      ...prev,
      [`wishlist_${product._id}`]: "add",
    }));

    try {
      const result = await addToWishlist(product._id);

      if (result.success) {
        setLoadingStates((prev) => ({
          ...prev,
          [`wishlist_${product._id}`]: "success",
        }));
        setTimeout(() => {
          setLoadingStates((prev) => ({
            ...prev,
            [`wishlist_${product._id}`]: null,
          }));
        }, 1500);
      } else {
        setLoadingStates((prev) => ({
          ...prev,
          [`wishlist_${product._id}`]: null,
        }));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setLoadingStates((prev) => ({
        ...prev,
        [`wishlist_${product._id}`]: null,
      }));
    }
  }; // Handle add to cart
  const handleAddToCart = async (product) => {
    setLoadingStates((prev) => ({
      ...prev,
      [`cart_${product._id}`]: "adding",
    }));

    try {
      await addToCart(product);
      toast.success(`${product.title} added to cart!`, {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#10B981",
          color: "white",
          fontWeight: "500",
          borderRadius: "12px",
          padding: "12px 16px",
        },
        icon: "🛒",
      });
      setLoadingStates((prev) => ({
        ...prev,
        [`cart_${product._id}`]: "success",
      }));
      setTimeout(() => {
        setLoadingStates((prev) => ({
          ...prev,
          [`cart_${product._id}`]: null,
        }));
      }, 1500);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#EF4444",
          color: "white",
          fontWeight: "500",
          borderRadius: "12px",
          padding: "12px 16px",
        },
        icon: "❌",
      });
      setLoadingStates((prev) => ({
        ...prev,
        [`cart_${product._id}`]: "error",
      }));
      setTimeout(() => {
        setLoadingStates((prev) => ({
          ...prev,
          [`cart_${product._id}`]: null,
        }));
      }, 2000);
    }
  };

  // Use the real-time wishlist check for heart icon
  const isInWishlist = checkIsInWishlist(product._id);

  // Calculate discounted price
  const discountedPrice =
    product.discount > 0
      ? (product.price * (100 - product.discount)) / 100
      : product.price;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl shadow-md bg-white hover:shadow-xl transition-all duration-300 h-full flex flex-col ${className}`}
    >
      <div className="relative overflow-hidden bg-white rounded-t-2xl flex-shrink-0">
        {/* Premium Badge - Mobile First */}
        <div className="absolute top-3 left-3 z-20">
          {product.discount > 0 ? (
            <div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg">
              <span>{product.discount}% OFF</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg">
              <Sparkles className="w-3 h-3" />
              <span>Premium</span>
            </div>
          )}
        </div>

        {/* Action Buttons - Mobile First with only Wishlist and Share */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleWishlistToggle();
            }}
            disabled={loadingStates[`wishlist_${product._id}`]}
            className={`w-9 h-9 rounded-full shadow-lg flex items-center justify-center border-2 relative overflow-hidden transition-all duration-300 cursor-pointer
                            ${
                              loadingStates[`wishlist_${product._id}`] ===
                              "success"
                                ? "bg-green-500 text-white border-green-500"
                                : isInWishlist
                                ? "bg-red-50 text-red-500 border-red-300"
                                : "bg-white/95 text-gray-700 border-gray-300"
                            }
                            ${
                              loadingStates[`wishlist_${product._id}`] &&
                              loadingStates[`wishlist_${product._id}`] !==
                                "success"
                                ? "animate-pulse"
                                : ""
                            }
                        `}
          >
            {loadingStates[`wishlist_${product._id}`] === "success" ? (
              <Check className="w-4 h-4" />
            ) : loadingStates[`wishlist_${product._id}`] &&
              loadingStates[`wishlist_${product._id}`] !== "success" ? (
              <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Heart
                className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`}
              />
            )}
          </button>

          {/* Share Button */}
          {showShareButton && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                shareWhatsApp();
              }}
              className="w-9 h-9 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center border-2 border-green-300 hover:bg-green-600 transition-all duration-300 cursor-pointer"
              title="Share on WhatsApp"
            >
              <Share className="w-4 h-4" />
            </button>
          )}
        </div>

        <Link to={`/product/${product._id}`} className="block">
          <div className="relative overflow-hidden">
            <img
              src={product.images?.[0]?.url || "/assets/images/chudi.jpeg"}
              alt={product.title}
              loading="lazy"
              className="w-full h-48 sm:h-56 md:h-64 object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                if (!e.target.src.includes("fallback-product.jpg")) {
                  e.target.src = "/assets/images/fallback-product.jpg";
                }
              }}
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
          </div>
        </Link>
      </div>

      {/* Product Info - Mobile First Design */}
      <div className="p-4 bg-white rounded-b-2xl flex-grow flex flex-col justify-between">
        {/* Product Title and Price */}
        <div className="mb-3">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-tight mb-2 hover:text-gray-700 transition-colors duration-300">
              {product.title}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">
                ₹{discountedPrice?.toLocaleString()}
              </span>
              {product.discount > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.price?.toLocaleString()}
                </span>
              )}
            </div>

            {/* Product ID - smaller and subtle */}
            {product.productId && (
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                #{product.productId}
              </span>
            )}
          </div>

          {/* Weight - if available */}
          {product.weight && (
            <p className="text-xs text-gray-500 mt-2">
              Weight: {product.weight}g
            </p>
          )}
        </div>

        {/* Action Button - Mobile First */}
        <div className="mt-auto">
          {showAddToCart && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(product);
              }}
              disabled={loadingStates[`cart_${product._id}`]}
              className={`w-full py-2.5 sm:py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 cursor-pointer
                                ${
                                  loadingStates[`cart_${product._id}`] ===
                                  "success"
                                    ? "bg-green-500 text-white"
                                    : "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white hover:from-gray-800 hover:via-gray-700 hover:to-gray-800"
                                }
                                ${
                                  loadingStates[`cart_${product._id}`] &&
                                  loadingStates[`cart_${product._id}`] !==
                                    "success"
                                    ? "animate-pulse"
                                    : ""
                                }
                            `}
            >
              {loadingStates[`cart_${product._id}`] === "success" ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : loadingStates[`cart_${product._id}`] &&
                loadingStates[`cart_${product._id}`] !== "success" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
