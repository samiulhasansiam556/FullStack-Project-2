import React, { useEffect, useState } from "react";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
        const authUser = JSON.parse(localStorage.getItem("authuser")); // Parse the user object from localStorage
        const userId = authUser._id; // Extract the user ID
        
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/orders/user/${userId}`, {
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

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="p-4 border rounded shadow-md">
              <h2 className="font-bold">Order ID: {order._id}</h2>
              <p>Status: {order.status}</p>
              <p>Total: ${order.totalAmount / 100}</p>
              <h3 className="font-semibold mt-2">Items:</h3>
              <ul className="list-disc ml-6">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.product} (x{item.quantity}) - ${item.price / 100} each
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500">Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
