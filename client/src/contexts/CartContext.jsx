import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);
  let debounceTimeout = null;

  // Load cart on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const parsedStoredCart = storedCart ? JSON.parse(storedCart) : [];

    if (parsedStoredCart.length > 0) {
      setCart(parsedStoredCart);
    }

    // Only fetch from backend on initial load (when user is defined but cart is empty)
    if (user && parsedStoredCart.length === 0) {
      const token = localStorage.getItem("token");
      axios
        .get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const backendCart = res.data.cart || [];
          if (backendCart.length > 0) {
            setCart(backendCart);
            localStorage.setItem("cart", JSON.stringify(backendCart));
          }
        })
        .catch((err) => console.error("Failed to fetch cart:", err));
    }
  }, []); // Only run once on mount

  // Debounced function to update backend
  const updateBackendCart = (newCart) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(async () => {
      if (user && user._id) {
        try {
          const token = localStorage.getItem("token");

          // Validate cart data before sending
          const validCart = newCart.filter(
            (item) =>
              item &&
              item._id &&
              typeof item._id === "string" &&
              item.title &&
              typeof item.price === "number" &&
              typeof item.quantity === "number"
          );

          await axios.put(
            "/api/auth/profile",
            { cart: validCart },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          // console.log('✅ Cart synced successfully');
        } catch (err) {
          console.error("Failed to sync cart:", err);
        }
      }
    }, 1000); // Wait 1 second before sending update
  };

  // Save cart to localStorage and debounce backend update
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateBackendCart(cart);
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item._id === product._id);
      if (existingItem) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
