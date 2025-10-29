import { useState } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import SEOMetaTags from "../components/SEO/SEOMetaTags";
import { generateLocalBusinessSchema } from "../components/SEO/StructuredData";
import { SEO_TEMPLATES } from "../components/SEO/seoConfig";

function ContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/contacts", formData);

      toast.success(
        "Thank you! Your message has been sent successfully. We will get back to you within 24 hours."
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 md:pt-20">
      <SEOMetaTags
        title={SEO_TEMPLATES.contact.title}
        description={SEO_TEMPLATES.contact.description}
        keywords={SEO_TEMPLATES.contact.keywords}
        canonicalUrl="https://abhushankalakendra.vercel.app/contact-us"
        structuredData={generateLocalBusinessSchema()}
        ogImage="https://abhushankalakendra.vercel.app/assets/images/contact-og.jpg"
      />
      {/* Premium Header */}
      <div className="bg-black text-white md:py-20 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            <span className="text-sm font-medium uppercase tracking-[0.3em] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Contact Us
            </span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent via-amber-400 to-transparent"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-thin mb-6 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Connect with our jewelry experts for custom orders, inquiries, and
            exceptional service
          </p>
        </div>
      </div>

      {/* Back Button - Mobile Only */}
      <div className="md:hidden bg-white border-b px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-amber-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Contact Information
              </h2>

              <div className="space-y-8">
                {/* Address */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    Visit Our Store
                  </h3>
                  <p className="text-gray-600 leading-relaxed ml-5">
                    Abhushan Kala Kendra
                    <br />
                    At- Samhauta Bazar
                    <br />
                    P.O- Bhabhata
                    <br />
                    Via- Chanpatia, West Champaran
                    <br />
                    Bihar – 845449
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    Call Us
                  </h3>
                  <div className="ml-5">
                    <a
                      href="tel:+917295810660"
                      className="text-gray-600 hover:text-amber-600 transition-colors text-lg"
                    >
                      +91-7295810660
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      Available for wedding orders & bulk bookings
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    Email Us
                  </h3>
                  <div className="ml-5">
                    <a
                      href="mailto:abhushankalakendra@gmail.com"
                      className="text-gray-600 hover:text-amber-600 transition-colors break-all"
                    >
                      abhushankalakendra@gmail.com
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      For inquiries, custom orders & support
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    Business Hours
                  </h3>
                  <div className="text-gray-600 ml-5 space-y-1">
                    <p>Monday - Saturday: 10:00 AM - 8:00 PM</p>
                    <p>Sunday: 11:00 AM - 6:00 PM</p>
                    <p className="text-sm text-amber-600 font-medium">
                      Closed on major holidays
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-amber-50 rounded-2xl p-6 md:p-8 border border-amber-100">
              <h3 className="text-xl font-medium text-gray-900 mb-6">
                Our Services
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    Hallmarked Gold & Silver
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Wedding Collections</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Custom Jewelry & Gifts</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    Wedding Orders (Poṭ Sets)
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Repairs & Aftercare</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Quality Guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white transition-all duration-300 text-gray-900"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white transition-all duration-300 text-gray-900"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white transition-all duration-300 text-gray-900"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white transition-all duration-300 text-gray-900"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="custom-order">Custom Order</option>
                  <option value="repair">Jewelry Repair</option>
                  <option value="return">Return/Exchange</option>
                  <option value="complaint">Complaint</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white transition-all duration-300 resize-none text-gray-900"
                  placeholder="Please describe your inquiry in detail..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-6 py-4 bg-black text-white font-medium rounded-lg hover:bg-amber-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Send Message
                  </>
                )}
              </button>
            </form>

            {/* Quick Contact Options */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-4 text-center">
                Need immediate assistance?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="tel:+917295810660"
                  className="flex items-center justify-center px-4 py-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium border border-amber-200"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
                <a
                  href="mailto:abhushankalakendra@gmail.com"
                  className="flex items-center justify-center px-4 py-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium border border-amber-200"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Us
                </a>
                <a
                  href="https://wa.me/917295810660"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium border border-amber-200"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Brand Attribution */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                <a
                  href="https://www.kalawatiputra.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-700 transition-colors underline"
                >
                  A brand of Kalawatiputra.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
