import { useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function AdminManageBookings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: () =>
      axios
        .get("/api/marriage-bookings/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => res.data),
    enabled: !!user,
  });

  const updateBookingStatus = useMutation({
    mutationFn: ({ id, status }) =>
      axios.put(
        `/api/marriage-bookings/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking status updated");
    },
    onError: () => toast.error("Failed to update booking status"),
  });

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="mr-6 p-3 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Manage Marriage Bookings
          </h2>
        </div>
        <div className="grid gap-6">
          {bookings?.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    User Information
                  </h3>
                  <p className="mt-2 text-gray-600">
                    <strong>Name:</strong>{" "}
                    {booking.user ? booking.user.name : booking.name}
                  </p>
                  <p className="mt-1 text-gray-600">
                    <strong>Email:</strong>{" "}
                    {booking.user ? booking.user.email : booking.email}
                  </p>
                  <p className="mt-1 text-gray-600">
                    <strong>Phone:</strong>{" "}
                    {booking.phone ||
                      (booking.user && booking.user.phone) ||
                      "Not provided"}
                  </p>
                  <p className="mt-1 text-gray-600">
                    <strong>Address:</strong>{" "}
                    {typeof (booking.address || booking.user.address) ===
                    "object"
                      ? Object.values(booking.address || booking.user.address)
                          .filter(Boolean)
                          .join(", ")
                      : booking.address ||
                        booking.user.address ||
                        "Not provided"}
                  </p>
                  <p className="mt-1 text-gray-600">
                    <strong>WhatsApp:</strong>{" "}
                    {booking.whatsapp ||
                      booking.user.whatsapp ||
                      "Not provided"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Booking Details
                  </h3>
                  <p className="mt-2 text-gray-600">
                    <strong>Product Type:</strong> {booking.productType}
                  </p>
                  {["Jewelry", "Fashion Products"].includes(
                    booking.productType
                  ) && (
                    <>
                      <p className="mt-1 text-gray-600">
                        <strong>Gold Weight:</strong>{" "}
                        {booking.goldWeight || "N/A"}g
                      </p>
                      <p className="mt-1 text-gray-600">
                        <strong>Silver Weight:</strong>{" "}
                        {booking.silverWeight || "N/A"}g
                      </p>
                    </>
                  )}
                  <p className="mt-1 text-gray-600">
                    <strong>Details:</strong> {booking.details}
                  </p>
                  <p className="mt-1 text-gray-600">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                        booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {booking.status === "pending"
                        ? "Booking Received"
                        : booking.status === "confirmed"
                        ? "Confirmed"
                        : booking.status === "completed"
                        ? "Completed"
                        : booking.status}
                    </span>
                  </p>
                  <h4 className="mt-4 text-md font-semibold text-gray-900">
                    Items
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {booking.items.map((item, index) => (
                      <li key={index} className="text-gray-600">
                        <strong>{item.name}</strong> ({item.type}, Qty:{" "}
                        {item.quantity})
                        <br />
                        <span className="text-sm">
                          {item.description || "No description"}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      updateBookingStatus.mutate({
                        id: booking._id,
                        status: e.target.value,
                      })
                    }
                    className="mt-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  >
                    <option value="pending">Booking Received</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminManageBookings;
