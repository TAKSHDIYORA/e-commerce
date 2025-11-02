import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/shopContext';
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {
  const { currency, backendUrl } = useContext(ShopContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("token");

        const response = await axios.post(
          `${backendUrl}/api/order/userorders`,
          { email },
          { headers: { token } }
        );

        console.log("✅ Orders Response:", response.data);

        if (response.data.status) {
          const totalItems = response.data.order.flatMap(order =>
            order.items.map(item => ({
              ...item,
              orderStatus: order.status,       // ✅ include order status
              orderDate: order.date,            // ✅ include order date
              paymentMethod: order.paymentMethod // ✅ include payment type from API
            }))
          );

          console.log(totalItems);
          setProducts(totalItems || []);
        } else {
          console.error("Failed to fetch orders:", response.data.message);
        }
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      }
    };

    fetchData();
  }, [backendUrl]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      case "processing":
        return "bg-orange-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {products.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20 rounded-md" src={item.image[0]} alt="" />

              <div>
                <p className="sm:text-base font-medium">{item.name}</p>

                <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                  <p className="text-lg">{currency}{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>

                <p className="mt-2">
                  Date:{" "}
                  <span className="text-gray-400">
                    {item.orderDate
                      ? new Date(item.orderDate).toLocaleDateString()
                      : "—"}
                  </span>
                </p>

                {/* ✅ Added payment type display */}
                <p className="mt-1">
                  Payment Method:{" "}
                  <span className="text-gray-500 capitalize">
                    {item.paymentMethod || "Not Specified"}
                  </span>
                </p>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span
                  className={`min-w-2 h-2 rounded-full ${getStatusColor(
                    item.orderStatus
                  )}`}
                ></span>
                <p className="text-sm md:text-base capitalize">
                  {item.orderStatus}
                </p>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="border px-4 py-2 text-sm font-medium rounded-sm"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
