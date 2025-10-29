import { createContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Configure axios defaults for better error handling
axios.defaults.timeout = 15000; // 15 second timeout
axios.defaults.baseURL =
  axios.defaults.baseURL || "https://apiabhushankalakendra.vercel.app/";

// Add axios interceptors for better error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout:", error);
    } else if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn("Unauthorized access - clearing token");
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]); // Track wishlist IDs for real-time updates

  // Refs to track ongoing operations and prevent race conditions
  const pendingOperations = useRef(new Set());
  const debounceTimeouts = useRef(new Map());
  const lastToastRef = useRef(null); // Prevent duplicate toasts

  // Debounce helper to prevent rapid duplicate calls
  const debounce = useCallback((func, delay, key) => {
    return (...args) => {
      // Clear existing timeout for this key
      if (debounceTimeouts.current.has(key)) {
        clearTimeout(debounceTimeouts.current.get(key));
      }

      // Set new timeout
      const timeoutId = setTimeout(() => {
        func(...args);
        debounceTimeouts.current.delete(key);
      }, delay);

      debounceTimeouts.current.set(key, timeoutId);
    };
  }, []);

  // Safe toast function to prevent duplicate messages
  const safeToast = useCallback((message, type = "success") => {
    // Prevent duplicate toasts within 1 second
    if (lastToastRef.current === message) {
      return;
    }

    lastToastRef.current = message;

    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    } else {
      toast(message);
    }

    // Clear the last toast reference after a delay
    setTimeout(() => {
      lastToastRef.current = null;
    }, 1000);
  }, []);

  // Check if operation is already pending to prevent duplicates
  const isOperationPending = useCallback((operation, productId) => {
    const key = `${operation}_${productId}`;
    return pendingOperations.current.has(key);
  }, []);

  // Mark operation as pending
  const markOperationPending = useCallback((operation, productId) => {
    const key = `${operation}_${productId}`;
    pendingOperations.current.add(key);
    return key;
  }, []);

  // Clear pending operation
  const clearPendingOperation = useCallback((key) => {
    pendingOperations.current.delete(key);
  }, []);

  // Helper function to get the correct wishlist localStorage key
  const getWishlistKey = (currentUser = null) => {
    const userToCheck = currentUser || user;
    if (userToCheck && userToCheck._id) {
      return `wishlist_user_${userToCheck._id}`;
    }
    return "wishlist_guest";
  };

  // Helper function to get wishlist from localStorage with correct key
  const getStoredWishlist = (currentUser = null) => {
    try {
      const key = getWishlistKey(currentUser);
      const stored = localStorage.getItem(key);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      // Clean up any object references, keep only string IDs
      const cleaned = parsed
        .map((item) =>
          typeof item === "object" && item._id
            ? item._id.toString()
            : item.toString()
        )
        .filter((id) => id && id !== "undefined" && id !== "null");

      // If we cleaned up the data, save the cleaned version
      if (cleaned.length !== parsed.length) {
        // console.log('🧹 Cleaning up wishlist data:', { original: parsed, cleaned });
        localStorage.setItem(key, JSON.stringify(cleaned));
      }

      return cleaned;
    } catch (error) {
      console.error("Error parsing stored wishlist:", error);
      return [];
    }
  };

  // Helper function to save wishlist to localStorage with correct key
  const saveWishlistToStorage = (wishlist, currentUser = null) => {
    try {
      const key = getWishlistKey(currentUser);
      localStorage.setItem(key, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Error saving wishlist to storage:", error);
    }
  };

  // Ensure user always has a wishlist array
  const ensureUserWishlist = (userData) => {
    if (!userData) return null;
    return {
      ...userData,
      wishlist: userData.wishlist || [],
    };
  };

  // Fetch wishlist products with full product data and ensure uniqueness
  const fetchWishlistProducts = async (wishlistIds) => {
    if (!wishlistIds || wishlistIds.length === 0) {
      setWishlistProducts([]);
      return [];
    }

    try {
      setIsWishlistLoading(true);

      // Ensure all IDs are strings and remove duplicates
      const uniqueIds = [
        ...new Set(
          wishlistIds
            .map((id) => {
              if (typeof id === "object" && id._id) {
                return id._id.toString();
              }
              return typeof id === "string" ? id : id.toString();
            })
            .filter((id) => id && id !== "undefined" && id !== "null")
        ),
      ];

      if (uniqueIds.length === 0) {
        setWishlistProducts([]);
        setIsWishlistLoading(false);
        return [];
      }

      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch full product details for wishlist items
      const productPromises = uniqueIds.map(async (id) => {
        try {
          const response = await axios.get(`/api/products/${id}`, { headers });
          return response.data;
        } catch (err) {
          console.warn(
            `Failed to fetch product ${id}:`,
            err.response?.data?.message || err.message
          );
          return null;
        }
      });

      const products = await Promise.all(productPromises);
      const validProducts = products.filter((product) => product !== null);

      // Remove duplicate products based on _id
      const uniqueProducts = validProducts.filter(
        (product, index, self) =>
          index === self.findIndex((p) => p._id === product._id)
      );

      // Update user and localStorage if we found invalid products
      if (validProducts.length !== uniqueIds.length) {
        const fetchedValidIds = uniqueProducts.map((p) => p._id.toString());
        const updatedWishlist = uniqueIds.filter((id) =>
          fetchedValidIds.includes(id)
        );

        // Update user state
        if (user && user._id) {
          setUser((prev) => ({ ...prev, wishlist: updatedWishlist }));
        }

        // Update localStorage
        const key = getWishlistKey();
        localStorage.setItem(key, JSON.stringify(updatedWishlist));

        // Clean backend if user is authenticated
        const invalidIds = uniqueIds.filter(
          (id) => !fetchedValidIds.includes(id)
        );
        if (token && user && user._id && invalidIds.length > 0) {
          try {
            for (const invalidId of invalidIds) {
              await axios.post(
                "/api/auth/wishlist/remove",
                { productId: invalidId },
                { headers }
              );
            }
          } catch (error) {
            console.warn("Failed to clean invalid items from wishlist:", error);
          }
        }
      }

      setWishlistProducts(uniqueProducts);
      // Update wishlistIds for real-time heart icon updates
      setWishlistIds(uniqueProducts.map((p) => p._id.toString()));
      setIsWishlistLoading(false);
      return uniqueProducts;
    } catch (error) {
      console.error("Error fetching wishlist products:", error);
      setWishlistProducts([]);
      setWishlistIds([]);
      setIsWishlistLoading(false);
      return [];
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // console.log('🔄 Initializing Auth...');
        const token = localStorage.getItem("token");
        // console.log('🎯 Initial state:', { token: !!token });

        if (token) {
          try {
            const res = await axios.get("/api/auth/profile", {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 10000, // 10 second timeout
            });

            // console.log('✅ User profile loaded:', { userId: res.data._id, wishlistLength: res.data.wishlist?.length });

            // Prioritize backend wishlist data - use only backend data for logged-in users
            const backendWishlist = res.data.wishlist || [];

            console.log("🔄 Auth init wishlist:", {
              backend: backendWishlist,
              source: "backend-only-on-init",
            });

            // Update user with backend wishlist only
            const userWithBackendWishlist = {
              ...res.data,
              wishlist: backendWishlist,
            };

            setUser(ensureUserWishlist(userWithBackendWishlist));
            saveWishlistToStorage(backendWishlist, res.data);

            // Clear any guest wishlist since user is logged in
            localStorage.removeItem("wishlist_guest");

            // Fetch full wishlist products with error handling
            try {
              await fetchWishlistProducts(backendWishlist);
            } catch (wishlistError) {
              console.warn("Failed to fetch wishlist products:", wishlistError);
              // Continue without wishlist products
            }
          } catch (error) {
            console.error("❌ Token validation failed:", error);

            // console.log('❌ Token validation failed, switching to guest mode');
            localStorage.removeItem("token");
            setUser(null);

            // Load guest wishlist but don't set user
            try {
              const guestWishlist = getStoredWishlist(null);
              if (guestWishlist.length > 0) {
                // console.log('🔄 Loading guest wishlist:', guestWishlist);
                await fetchWishlistProducts(guestWishlist);
              }
            } catch (guestError) {
              console.warn("Failed to load guest wishlist:", guestError);
              // Continue without guest wishlist
            }
          }
        } else {
          // No token - check for guest wishlist but stay in logged out state
          try {
            const guestWishlist = getStoredWishlist(null);
            // console.log('🎯 No token, loading guest wishlist:', guestWishlist);
            setUser(null); // Ensure user is null for logged out state
            if (guestWishlist.length > 0) {
              // console.log('✅ Loading guest wishlist:', guestWishlist);
              await fetchWishlistProducts(guestWishlist);
            }
          } catch (guestError) {
            console.warn("Failed to load guest wishlist:", guestError);
            // Continue without guest wishlist
          }
        }
      } catch (initError) {
        console.error("❌ Auth initialization failed:", initError);
        // Ensure we're in a clean state even if initialization fails
        setUser(null);
        setWishlistProducts([]);
        setWishlistIds([]);
      } finally {
        // Always set loading to false, regardless of success or failure
        // console.log('🏁 Auth initialization complete');
        setIsLoading(false);
      }
    };

    initializeAuth().catch((error) => {
      console.error("❌ Critical auth initialization error:", error);
      setIsLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        "/api/auth/login",
        {
          email,
          password,
        },
        {
          timeout: 10000, // 10 second timeout
        }
      );
      localStorage.setItem("token", res.data.token);

      // Prioritize backend wishlist data and only merge guest items if user has no backend wishlist
      const backendWishlist = res.data.user.wishlist || [];
      let finalWishlist = [...backendWishlist];

      // Only merge guest wishlist if the user has no backend wishlist
      if (backendWishlist.length === 0) {
        const guestWishlist = getStoredWishlist(null);
        finalWishlist = [...new Set([...backendWishlist, ...guestWishlist])];
      }

      console.log("🔐 Login wishlist logic:", {
        backend: backendWishlist,
        final: finalWishlist,
        source:
          backendWishlist.length > 0 ? "backend-only" : "backend-plus-guest",
      });

      const userWithWishlist = {
        ...res.data.user,
        wishlist: finalWishlist,
      };

      setUser(userWithWishlist);
      saveWishlistToStorage(finalWishlist, res.data.user);

      // Clear guest wishlist after successful login
      localStorage.removeItem("wishlist_guest");

      // Sync wishlist to backend if we added guest items
      if (finalWishlist.length !== backendWishlist.length) {
        try {
          // Add each guest item that's not in backend
          const itemsToAdd = finalWishlist.filter(
            (id) =>
              !backendWishlist.some(
                (backendId) =>
                  (typeof backendId === "object"
                    ? backendId._id.toString()
                    : backendId.toString()) === id.toString()
              )
          );

          for (const productId of itemsToAdd) {
            await axios.post(
              "/api/auth/wishlist/add",
              { productId },
              { headers: { Authorization: `Bearer ${res.data.token}` } }
            );
          }
        } catch (syncError) {
          console.warn("Failed to sync wishlist on login:", syncError);
        }
      }

      // Fetch full wishlist products after login
      await fetchWishlistProducts(finalWishlist);
      setIsLoading(false);
      toast.success("Logged in successfully!");
      return { success: true, redirectTo: "/" };
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // Registration doesn't log the user in - they need to verify email first
      // Don't set token or user in state
      setIsLoading(false);

      toast.success(
        res.data.msg ||
          "Registration successful! Please check your email to verify your account.",
        { duration: 6000 }
      );

      // Redirect to login page with a message
      return {
        success: true,
        redirectTo: "/login",
        message: "Please verify your email before logging in",
      };
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      toast.success("Password reset email sent!");
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const res = await axios.post("/api/auth/reset-password", {
        token,
        newPassword,
      });
      toast.success("Password reset successfully!");
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("cart");

    // Clear ALL wishlist data from localStorage to prevent cross-contamination
    // Remove current user's wishlist if exists
    if (user && user._id) {
      localStorage.removeItem(`wishlist_user_${user._id}`);
    }
    // Remove guest wishlist
    localStorage.removeItem("wishlist_guest");

    // Clear any other potential wishlist keys (cleanup for safety)
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("wishlist_")) {
        localStorage.removeItem(key);
      }
    });

    // Set user to null to indicate logged out state
    setUser(null);

    // Clear wishlist state
    setWishlistProducts([]);
    setWishlistIds([]);

    toast.success("Logged out successfully!");
    return { success: true, redirectTo: "/login" };
  };

  const addToWishlist = useCallback(
    async (productId) => {
      // Ensure productId is a string
      const id =
        typeof productId === "object" && productId._id
          ? productId._id.toString()
          : productId.toString();

      // Check if operation is already pending
      if (isOperationPending("add", id)) {
        return { success: false, message: "Operation already in progress" };
      }

      // Mark operation as pending
      const operationKey = markOperationPending("add", id);

      try {
        if (!user || !user._id) {
          // Guest user - handle separately
          const storedWishlist = getStoredWishlist(null);

          if (storedWishlist.includes(id)) {
            safeToast("Already in wishlist", "error");
            return { success: false, message: "Already in wishlist" };
          }

          const updatedWishlist = [...storedWishlist, id];
          saveWishlistToStorage(updatedWishlist, null);
          await fetchWishlistProducts(updatedWishlist);
          safeToast("Added to wishlist", "success");

          // Show login prompt for guest users only (delayed)
          setTimeout(() => {
            toast("Please login to sync your wishlist", { icon: "ℹ️" });
          }, 2000);
          return { success: true, message: "Added to wishlist" };
        }

        // For authenticated users - check both frontend state and backend
        // Check frontend state first for immediate feedback
        if (wishlistIds.includes(id)) {
          safeToast("Already in wishlist", "error");
          return { success: false, message: "Already in wishlist" };
        }

        // Add to wishlist with dedicated API endpoint
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "/api/auth/wishlist/add",
          { productId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update user state
        setUser(response.data);

        // Update wishlistIds for real-time heart updates
        const newWishlistIds = [
          ...new Set(
            response.data.wishlist.map((item) =>
              typeof item === "object" && item._id
                ? item._id.toString()
                : item.toString()
            )
          ),
        ];

        setWishlistIds(newWishlistIds);
        saveWishlistToStorage(newWishlistIds, response.data);

        // Update wishlist products state
        setWishlistProducts(response.data.wishlist || []);
        safeToast("Added to wishlist", "success");

        return { success: true, message: "Added to wishlist" };
      } catch (err) {
        console.error("Failed to add to wishlist:", err);
        if (
          err.response?.status === 400 &&
          err.response?.data?.msg?.includes("already")
        ) {
          safeToast("Already in wishlist", "error");
          return { success: false, message: "Already in wishlist" };
        } else {
          safeToast("Failed to add to wishlist", "error");
          return { success: false, message: "Failed to add to wishlist" };
        }
      } finally {
        // Clear pending operation
        clearPendingOperation(operationKey);
      }
    },
    [
      user,
      wishlistIds,
      isOperationPending,
      markOperationPending,
      clearPendingOperation,
      getStoredWishlist,
      saveWishlistToStorage,
      fetchWishlistProducts,
      safeToast,
    ]
  );

  // Function to remove from wishlist (only for profile page)
  const removeFromWishlistProfile = useCallback(
    async (productId, fromProfilePage = true) => {
      // Only allow removal from profile page
      if (!fromProfilePage) {
        return {
          success: false,
          message: "Removal only allowed from profile page",
        };
      }

      // Ensure productId is a string
      const id =
        typeof productId === "object" && productId._id
          ? productId._id.toString()
          : productId.toString();

      // Check if operation is already pending
      if (isOperationPending("remove", id)) {
        return { success: false, message: "Operation already in progress" };
      }

      // Mark operation as pending
      const operationKey = markOperationPending("remove", id);

      try {
        // Check if product exists in wishlist (frontend check)
        if (!wishlistIds.includes(id)) {
          safeToast("Product not in wishlist", "error");
          return { success: false, message: "Product not in wishlist" };
        }

        if (user && user._id) {
          // Authenticated user
          const token = localStorage.getItem("token");
          const response = await axios.post(
            "/api/auth/wishlist/remove",
            { productId: id },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setUser(response.data);

          // Update wishlistIds for real-time heart updates
          const newWishlistIds = [
            ...new Set(
              response.data.wishlist.map((item) =>
                typeof item === "object" && item._id
                  ? item._id.toString()
                  : item.toString()
              )
            ),
          ];

          setWishlistIds(newWishlistIds);
          saveWishlistToStorage(newWishlistIds, response.data);

          // Update wishlist products state
          setWishlistProducts(response.data.wishlist || []);
        } else {
          // Guest user
          const currentWishlist = getStoredWishlist(null);
          const updatedWishlist = currentWishlist.filter(
            (itemId) => itemId !== id
          );

          setWishlistIds(updatedWishlist);
          saveWishlistToStorage(updatedWishlist, null);
          await fetchWishlistProducts(updatedWishlist);
        }

        safeToast("Removed from wishlist", "success");
        return { success: true, message: "Removed from wishlist" };
      } catch (err) {
        console.error("Failed to remove from wishlist:", err);
        safeToast("Failed to remove from wishlist", "error");
        return { success: false, message: "Failed to remove from wishlist" };
      } finally {
        // Clear pending operation
        clearPendingOperation(operationKey);
      }
    },
    [
      user,
      wishlistIds,
      isOperationPending,
      markOperationPending,
      clearPendingOperation,
      getStoredWishlist,
      saveWishlistToStorage,
      fetchWishlistProducts,
      safeToast,
    ]
  );

  // Legacy removeFromWishlist for backward compatibility (deprecated)
  const removeFromWishlist = useCallback(
    async (productId) => {
      return removeFromWishlistProfile(productId, false);
    },
    [removeFromWishlistProfile]
  );

  // Helper function to check if product is in wishlist (using wishlistIds for real-time updates)
  const isInWishlist = useCallback(
    (productId) => {
      try {
        // Sanitize productId
        const id =
          typeof productId === "object" && productId._id
            ? productId._id.toString()
            : productId.toString();

        // Use wishlistIds state for real-time updates
        return wishlistIds.includes(id);
      } catch (error) {
        console.error("Error checking wishlist:", error);
        return false;
      }
    },
    [wishlistIds]
  );

  // Helper function to get current wishlist
  const getCurrentWishlist = () => {
    try {
      return user?.wishlist || getStoredWishlist(user);
    } catch (error) {
      console.error("Error getting wishlist:", error);
      return [];
    }
  };

  // Sync wishlist state (useful for debugging)
  const syncWishlist = () => {
    try {
      const storedWishlist = getStoredWishlist(user);
      if (storedWishlist.length > 0) {
        setUser((prev) => ({ ...prev, wishlist: storedWishlist }));
        fetchWishlistProducts(storedWishlist);
      }
    } catch (error) {
      console.error("Error syncing wishlist:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        addToWishlist,
        removeFromWishlist,
        removeFromWishlistProfile, // New function for profile page only
        isLoading,
        isWishlistLoading,
        wishlistProducts,
        wishlistIds, // Export wishlistIds for real-time heart updates
        fetchWishlistProducts,
        isInWishlist,
        getCurrentWishlist,
        syncWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
