import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
        const authUser = JSON.parse(localStorage.getItem("authuser")); // Parse the user object from localStorage
        const userId = authUser._id; // Extract the user ID
        
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/orders/admin`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authtoken")}`,
          },
        });
        
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
        const authUser = JSON.parse(localStorage.getItem("authuser")); // Parse the user object from localStorage
        const userId = authUser._id; // Extract the user ID
        
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/orders/update-status/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authtoken")}`,
        },
        body: JSON.stringify({ orderId, status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder.order._id ? updatedOrder.order : order
        )
      );

      fetchOrders();
      alert("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
return (
  <div className="p-4 md:p-6">
    <h1 className="text-2xl font-bold mb-4">All Orders</h1>
    {orders.length === 0 ? (
      <p>No orders found.</p>
    ) : (
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="p-4 border rounded shadow-md bg-white"
          >
            <h2 className="font-bold text-lg break-all">
              Order ID: {order._id}
            </h2>

            <p className="mt-1">Status: {order.status}</p>
            <p>Total: ${order.totalAmount / 100}</p>

            <h3 className="font-semibold mt-3">Items:</h3>
            <ul className="list-disc ml-6 text-sm">
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} (Quantity-{item.quantity}) — $
                  {item.price / 100} each
                </li>
              ))}
            </ul>

            <p className="text-sm text-gray-500 mt-2">
              Ordered on:{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => updateOrderStatus(order._id, "Processing")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Mark as Processing
              </button>
              <button
                onClick={() => updateOrderStatus(order._id, "Shipped")}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Mark as Shipped
              </button>
              <button
                onClick={() => updateOrderStatus(order._id, "Delivered")}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Mark as Delivered
              </button>
              <button
                onClick={() => updateOrderStatus(order._id, "Cancelled")}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel Order
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

};

export default AdminOrders;
