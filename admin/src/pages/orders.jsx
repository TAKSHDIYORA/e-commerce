import React, { useEffect, useState } from "react";
import axios from "axios";
import {backendUrl} from '../App'
const Orders = () => {
  const [orders, setOrders] = useState([]);
  // const {backendUrl} = ; // your backend
  const currency = "$";

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("Admin_token");
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (response.data.status) {
        // ✅ Flatten orders + include orderId + status in each item
        const allItems = response.data.orders
          .map((order) =>
            order.items.map((item) => ({
              ...item,
              orderId: order._id,
              status: order.status,
            }))
          )
          .flat();
          // console.log(orders[0]);
          

        setOrders(allItems);
      }
    } catch (error) {
      console.error("Error fetching admin orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Handle Status Change (Instant UI Update)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("Admin_token");

      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      );

      if (response.data.status) {
        // ✅ Update UI immediately
        setOrders((prevOrders) =>
          prevOrders.map((item) =>
            item.orderId === orderId ? { ...item, status: newStatus } : item
          )
        );
      } else {
        alert("❌ Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">🧾 All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-full h-60 object-contain bg-gray-100 rounded-t-2xl"
              />

              <div className="p-4">
                <h2 className="text-lg font-bold mb-1">{item.name}</h2>
                <p className="text-sm text-gray-500 mb-3">{item.description}</p>

                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium text-gray-600">Category:</span>
                  <span>{item.category}</span>
                </div>

                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium text-gray-600">Subcategory:</span>
                  <span>{item.subcategory}</span>
                </div>

                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium text-gray-600">Size:</span>
                  <span>{item.size}</span>
                </div>

                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium text-gray-600">Price:</span>
                  <span>
                    {currency}
                    {item.price}
                  </span>
                </div>

                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium text-gray-600">Quantity:</span>
                  <span>{item.quantity}</span>
                </div>

                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium text-gray-600">Date:</span>
                  <span>
                    {new Date(item.date).toLocaleDateString("en-IN")}
                  </span>
                </div>

                {/* ✅ Status Dropdown */}
                <div className="flex justify-between items-center mt-3">
                  <span className="font-medium text-gray-600">Status:</span>
                  <select
                    value={item.status } // ✅ ensures controlled value
                    onChange={(e) =>
                      handleStatusChange(item.orderId, e.target.value)
                    }
                    className="border rounded-md px-2 py-1 text-sm bg-gray-50 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
