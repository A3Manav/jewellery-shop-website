import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/newsletter/subscribe", {
        email: email.trim(),
      });

      toast.success(
        response.data.message || "Successfully subscribed to newsletter!"
      );
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);

      if (error.response?.status === 409) {
        toast.error("This email is already subscribed to our newsletter");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to subscribe. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareWishlist = () => {
    const message = encodeURIComponent(
      "Check out my jewelry wishlist! Visit: https://abhushankalakendra.com/wishlist"
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <footer className="bg-black text-neutral-300 py-12" role="contentinfo">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* About Section */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <img
              src="https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png"
              alt="Abhushan Kala Kendra Logo"
              className="h-10 w-10 rounded-full object-cover border border-yellow-500"
            />
            <h3 className="text-xl font-semibold text-white">
              Abhushan Kala Kendra
            </h3>
          </div>
          <p className="text-sm text-neutral-400">
            Where Trust Meets Elegance. Authentic hallmarked gold and silver
            jewellery that blends tradition with modern design.
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://facebook.com/abhushankalakendra"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook className="text-xl hover:text-yellow-500 transition" />
            </a>
            <a
              href="https://instagram.com/abhushankalakendra"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="text-xl hover:text-yellow-500 transition" />
            </a>
            <a
              href="https://twitter.com/abhushankendra"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter className="text-xl hover:text-yellow-500 transition" />
            </a>
          </div>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Customer Service
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/contact-us"
                className="hover:text-yellow-500 transition"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/refund-return-policy"
                className="hover:text-yellow-500 transition"
              >
                Returns & Refunds
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-yellow-500 transition">
                My Account
              </Link>
            </li>
            <li>
              <Link
                to="/marriage-booking"
                className="hover:text-yellow-500 transition"
              >
                Wedding Jewelry
              </Link>
            </li>
          </ul>
        </div>

        {/* Shop Section */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Shop</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/store"
                className="hover:text-yellow-500 transition font-medium"
              >
                All Products
              </Link>
            </li>
            <li>
              <Link
                to="/products/pots"
                className="hover:text-yellow-500 transition"
              >
                Pot Items
              </Link>
            </li>
            <li>
              <Link
                to="/products/gifts"
                className="hover:text-yellow-500 transition"
              >
                Gift Items
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-yellow-500 transition">
                Shopping Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter + Contact */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Contact & Orders
          </h3>
          <p className="text-sm text-neutral-400 mb-2">
            Email: abhushankalakendra@gmail.com
          </p>
          <p className="text-sm text-neutral-400 mb-6">
            Call/WhatsApp: +91-7295810660
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col gap-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-2 bg-neutral-800 text-white placeholder-gray-400 border border-neutral-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              aria-label="Email for newsletter subscription"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md hover:bg-yellow-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
          <button
            onClick={() =>
              window.open(
                "https://wa.me/917295810660?text=Hi! I would like to inquire about your hallmarked jewelry collection",
                "_blank"
              )
            }
            className="mt-4 flex items-center gap-2 text-sm text-neutral-400 hover:text-yellow-500 transition"
            aria-label="Contact via WhatsApp"
          >
            <FaWhatsapp className="text-xl" />
            WhatsApp Us
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-neutral-700 pt-6 text-center text-sm text-neutral-500">
        <p>
          &copy; 2025 Abhushan Kala Kendra – Hallmarked Gold & Silver Jewellery
          | Pots | Customized Gifts
        </p>

        <div className="mt-2 text-sm text-neutral-400">
          <a
            href="https://www.kalawatiputra.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-500 transition-colors duration-200"
          >
            A brand of Kalawatiputra.com
          </a>
        </div>

        <div className="mt-4 text-sm text-neutral-400">
          <p>📍 Samhauta Bazar, West Champaran, Bihar | 📞 +91-7295810660</p>
        </div>

        <div className="flex justify-center gap-6 mt-3">
          <Link
            to="/terms-and-conditions"
            className="hover:text-yellow-500 transition"
          >
            Terms & Conditions
          </Link>
          <Link
            to="/refund-return-policy"
            className="hover:text-yellow-500 transition"
          >
            Return Policy
          </Link>
          <Link to="/contact-us" className="hover:text-yellow-500 transition">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
