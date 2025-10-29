import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  Home,
  Briefcase,
  MapPinned,
  Edit2,
  Trash2,
  Check,
  MapPin,
  Phone,
} from "lucide-react";
import AddressForm from "./AddressForm";

function SavedAddresses({ onSelectAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);

      // Check if user is authenticated
      const token = localStorage.getItem("token");
      if (!token) {
        // Silently skip loading addresses if not authenticated
        setAddresses([]);
        setIsLoading(false);
        return;
      }

      const response = await axios.get("/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data);

      // Auto-select default address or first address
      const defaultAddr = response.data.find((addr) => addr.isDefault);
      const addrToSelect = defaultAddr || response.data[0];
      if (addrToSelect) {
        setSelectedAddress(addrToSelect._id);
        onSelectAddress(addrToSelect);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      // Only show error if it's not an authentication issue
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to load saved addresses");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async (formData) => {
    try {
      const tokenBefore = localStorage.getItem("token");
      console.log(
        "💾 Starting address save with token:",
        tokenBefore ? "Present" : "Missing"
      );

      if (!tokenBefore) {
        toast.error("Please login to save address");
        return;
      }

      // Check if token is expired
      try {
        const payload = JSON.parse(atob(tokenBefore.split(".")[1]));
        const currentTime = Date.now() / 1000;
        console.log("⏰ Token expiry check:", {
          expiresAt: payload.exp,
          currentTime: currentTime,
          isExpired: payload.exp < currentTime,
        });
      } catch (e) {
        console.log("⚠️ Could not parse token for expiry check");
      }

      if (editingAddress) {
        // Update existing address
        const response = await axios.put(
          `/api/addresses/${editingAddress._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${tokenBefore}`,
            },
          }
        );
        console.log("✅ Address updated:", response.data);
        toast.success("Address updated successfully");
        setAddresses((prev) =>
          prev.map((addr) =>
            addr._id === editingAddress._id ? response.data : addr
          )
        );

        // Re-fetch addresses to get updated default status
        try {
          await fetchAddresses();
        } catch (fetchError) {
          console.error(
            "❌ Error re-fetching addresses after save:",
            fetchError
          );
          console.error("Fetch error details:", {
            status: fetchError.response?.status,
            message: fetchError.response?.data?.msg || fetchError.message,
          });
        }
      } else {
        // Create new address
        console.log("📤 Creating new address...");
        const response = await axios.post("/api/addresses", formData, {
          headers: { Authorization: `Bearer ${tokenBefore}` },
        });
        console.log("✅ Address created:", response.data);
        toast.success("Address saved successfully");
        setAddresses((prev) => [...prev, response.data]);

        // Check token after API call
        const tokenAfter = localStorage.getItem("token");
        console.log(
          "🔍 Token after API call:",
          tokenAfter ? "Present" : "Missing"
        );
        if (tokenBefore !== tokenAfter) {
          console.log("⚠️ Token changed during API call!");
        }

        // Auto-select newly added address
        setSelectedAddress(response.data._id);
        onSelectAddress(response.data);
      }
      setShowAddForm(false);
      setEditingAddress(null);

      // Re-fetch addresses to get updated default status
      try {
        await fetchAddresses();
      } catch (fetchError) {
        console.error("❌ Error re-fetching addresses after save:", fetchError);
        console.error("Fetch error details:", {
          status: fetchError.response?.status,
          message: fetchError.response?.data?.msg || fetchError.message,
        });
      }

      // Add debugging for redirect issue
      console.log("🎯 Address save completed successfully");
      console.log("📍 Current location:", window.location.pathname);
      console.log(
        "🔑 Token after save:",
        localStorage.getItem("token") ? "Present" : "Missing"
      );
      console.log("👤 User state check needed here");
    } catch (error) {
      console.error("❌ Error saving address:", error);
      console.error("Error details:", {
        status: error.response?.status,
        message: error.response?.data?.msg || error.message,
      });
      toast.error(error.response?.data?.msg || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      await axios.delete(`/api/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Address deleted successfully");
      setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));

      // If deleted address was selected, select another
      if (selectedAddress === addressId) {
        const remaining = addresses.filter((addr) => addr._id !== addressId);
        if (remaining.length > 0) {
          setSelectedAddress(remaining[0]._id);
          onSelectAddress(remaining[0]);
        } else {
          setSelectedAddress(null);
          onSelectAddress(null);
        }
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address._id);
    onSelectAddress(address);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case "home":
        return <Home className="w-5 h-5" />;
      case "office":
        return <Briefcase className="w-5 h-5" />;
      case "other":
        return <MapPinned className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Select Delivery Address
        </h3>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <AddressForm
          address={editingAddress}
          onSave={handleSaveAddress}
          onCancel={() => {
            setShowAddForm(false);
            setEditingAddress(null);
          }}
        />
      )}

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No saved addresses</p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="mt-4 px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedAddress === address._id
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleSelectAddress(address)}
            >
              {/* Radio Button */}
              <div className="absolute top-4 right-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAddress === address._id
                      ? "border-gray-900 bg-gray-900"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAddress === address._id && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>

              {/* Address Content */}
              <div className="pr-8">
                <div className="flex items-center gap-2 mb-2">
                  {getAddressIcon(address.type)}
                  <span className="font-semibold text-gray-900 capitalize">
                    {address.type}
                  </span>
                  {address.isDefault && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                      Default
                    </span>
                  )}
                </div>

                <p className="font-medium text-gray-900 mb-1">
                  {address.firstName} {address.lastName}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  {address.street}
                  {address.apartment && `, ${address.apartment}`}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {address.city}, {address.state} {address.pincode}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {address.phone}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditAddress(address);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddress(address._id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedAddresses;
