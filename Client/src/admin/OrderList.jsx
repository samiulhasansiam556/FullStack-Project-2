import { useState, useEffect } from 'react';
import axios from 'axios';

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders/admin');
        setOrders(Array.isArray(response.data) ? response.data : []); // Ensure orders is an array
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    console.log(orderId,status)
    try {
      await axios.put(`/api/orders/update-status/${orderId}`, { status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.length > 0 ? (
          orders.map((order) => (
            <li key={order._id} className="flex justify-between">
              <span>{order.productName}</span>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </li>
          ))
        ) : (
          <p>No orders available</p>
        )}
      </ul>
    </div>
  );
}

export default OrderList;
