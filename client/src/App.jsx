import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import MarriageBooking from "./pages/MarriageBooking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthSuccess from "./pages/AuthSuccess";
import AuthError from "./pages/AuthError";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManageProducts from "./pages/AdminManageProducts";
import AdminManageUsers from "./pages/AdminManageUsers";
import AdminManageRates from "./pages/AdminManageRates";
import AdminManageOrders from "./pages/AdminManageOrders";
import AdminManageBookings from "./pages/AdminManageBookings";
import AdminManageEditorials from "./pages/AdminManageEditorials";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminEditProduct from "./pages/AdminEditProduct";
import CategoryForm from "./pages/CategoryForm";
import PotsPage from "./pages/PotsPage";
import JewelryPage from "./pages/JewelryPage";
import GiftsPage from "./pages/GiftsPage";
import CarouselAdmin from "./pages/CarouselAdmin";
import AllProductsPage from "./pages/AllProductsPage";
import TermsAndConditions from "./pages/TermsAndConditions";
import ContactUs from "./pages/ContactUs";
import RefundReturnPolicy from "./pages/RefundReturnPolicy";
import StorePage from "./pages/StorePage";
import AdminManageContacts from "./pages/AdminManageContacts";
import AdminManageNewsletter from "./pages/AdminManageNewsletter";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import NotFound from "./pages/NotFound";
import AdminManageCategories from "./pages/AdminManageCategories";
import AllCategoriesPage from "./pages/AllCategoriesPage";

function AppContent() {
  const location = useLocation();
  const isStorePage = location.pathname === "/store";

  return (
    <>
      {/* Hide navbar on mobile for store page only */}
      <div className={`${isStorePage ? "hidden md:block" : ""}`}>
        <Navbar />
      </div>
      <ScrollToTop />
      <PWAInstallPrompt />
      <Routes key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/categories" element={<AllCategoriesPage />} />
        <Route path="/category/:id" element={<Category />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        {/* <Route path="/pots" element={<PotsPage />} /> */}
        {/* <Route path="/jewellery" element={<JewelryPage />} /> */}
        {/* <Route path="/gifts" element={<GiftsPage />} /> */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order/:orderId" element={<OrderDetailsPage />} />
        <Route path="/marriage-booking" element={<MarriageBooking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/auth/error" element={<AuthError />} />
        <Route path="/admin/add-product" element={<AdminAddProduct />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin/manage-products"
          element={<AdminManageProducts />}
        />
        <Route path="/admin/manage-users" element={<AdminManageUsers />} />
        <Route path="/admin/manage-rates" element={<AdminManageRates />} />
        <Route path="/admin/manage-orders" element={<AdminManageOrders />} />
        <Route
          path="/admin/manage-categories"
          element={<AdminManageCategories />}
        />
        <Route
          path="/admin/manage-bookings"
          element={<AdminManageBookings />}
        />
        <Route
          path="/admin/manage-editorials"
          element={<AdminManageEditorials />}
        />
        <Route
          path="/admin/manage-contacts"
          element={<AdminManageContacts />}
        />
        <Route
          path="/admin/manage-newsletter"
          element={<AdminManageNewsletter />}
        />
        <Route path="/admin/carousel" element={<CarouselAdmin />} />
        <Route path="/products/:category" element={<AllProductsPage />} />
        <Route
          path="/admin/add-category"
          element={
            <ErrorBoundary>
              <CategoryForm />
            </ErrorBoundary>
          }
        />
        <Route
          path="/admin/edit-category/:id"
          element={
            <ErrorBoundary>
              <CategoryForm />
            </ErrorBoundary>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <ErrorBoundary>
              <AdminEditProduct />
            </ErrorBoundary>
          }
        />
        <Route
          path="/terms-and-conditions"
          element={
            <ErrorBoundary>
              <TermsAndConditions />
            </ErrorBoundary>
          }
        />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/refund-return-policy" element={<RefundReturnPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
