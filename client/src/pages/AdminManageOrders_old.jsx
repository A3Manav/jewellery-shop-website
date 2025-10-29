import { useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function AdminManageOrders() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      axios
        .get("/api/orders/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => res.data),
    enabled: !!user,
  });

  const updateOrderStatus = useMutation({
    mutationFn: ({ id, status }) =>
      axios.put(
        `/api/orders/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update order status"),
  });

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading orders: {error.message}</div>;
  }

  return (
    <div className="pt-20 container mx-auto px-4 mt-10">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mr-6 p-3 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-purple-600"
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
        <h2 className="text-3xl font-bold">Manage Orders</h2>
      </div>
      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order._id} className="border border-black p-4">
            <p>
              <strong>Order ID:</strong> {order.orderId}
            </p>
            <p>
              <strong>User:</strong>{" "}
              {order.user
                ? `${order.user.name} (${order.user.email})`
                : "Guest"}
            </p>
            <p>
              <strong>Total:</strong> ₹{order.totalAmount}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Products:</strong>
            </p>
            <ul className="ml-4 list-disc">
              {order.products.map((item, index) => (
                <li key={`${item.product?._id || index}-${index}`}>
                  {item.product
                    ? `${item.product.title} (Qty: ${item.quantity})`
                    : `Unknown Product (Qty: ${item.quantity})`}
                </li>
              ))}
            </ul>
            <select
              value={order.status}
              onChange={(e) =>
                updateOrderStatus.mutate({
                  id: order._id,
                  status: e.target.value,
                })
              }
              className="border border-black p-2 mt-2"
            >
              <option value="pending">Order Placed Successfully</option>
              <option value="processing">Preparing Order</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminManageOrders;
