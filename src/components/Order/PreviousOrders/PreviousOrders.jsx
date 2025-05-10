import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PreviousOrders.css";
import { getPreviousOrders } from "../../../services/ApiService";

const PreviousOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    async function fetchOrders() {
      try {
        const response = await getPreviousOrders(userId);
        console.log(response);

        const sortedOrders = response.sort((a, b) => {
          const statusA = a.orderStatusId;
          const statusB = b.orderStatusId;

          if (statusA === 3) return -1;
          if (statusB === 3) return 1;
          if (statusA === 4) return -1;
          if (statusB === 4) return 1;
          return statusA - statusB;
        });

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching previous orders:", error);
      }
    }

    if (userId) {
      fetchOrders();
    }
  }, []);

  const handleProductClick = (orderId, productId) => {
    navigate(`/previousOrderDetails/${orderId}/product/${productId}`);
    localStorage.setItem("selectedProductId", productId);
    localStorage.setItem("orderId", orderId);
  };

  return (
    <div className="previous-orders-container">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p className="no-orders">You have no previous orders.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.orderId} className="order-card">
              <p className="order-status">
                {order.orderStatusId === 4
                  ? `Delivered on ${new Date(
                      order.orderDeliveredDate
                    ).toLocaleDateString("en-GB")}`
                  : order.orderStatusId === 5
                  ? `Canceled on ${new Date(
                      order.orderStatusDate
                    ).toLocaleDateString("en-GB")}`
                  : `Delivering on ${new Date(
                      order.orderEstimatedDate
                    ).toLocaleDateString("en-GB")}`}
              </p>
              <div className="order-details1">
                {order.products.map((item) => (
                  <div
                    key={item.productId}
                    className="order-item"
                    onClick={() =>
                      handleProductClick(order.orderId, item.productId)
                    }
                  >
                    <img
                      src={`data:image/jpeg;base64,${item.productImages}`}
                      alt={item.productName}
                      className="product-image"
                    />
                    <div className="item-details">
                      <p className="product-name">{item.productName}</p>
                      <p className="price">₹ {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviousOrders;