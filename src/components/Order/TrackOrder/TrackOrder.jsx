import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaShippingFast, FaBox, FaTruck } from "react-icons/fa";
import { getTrackOrder } from "../../../services/ApiService";
import "./TrackOrder.css";

const TrackOrder = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [addressVisible, setAddressVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderId = localStorage.getItem("orderId");
      if (orderId) {
        try {
          const orderResponse = await getTrackOrder(orderId);
          const orderData = orderResponse;

          const statusTimeline = [
            {
              status: "Order is Placed",
              icon: <FaCheckCircle />,
              color: "green",
              date: new Date(orderData.orderDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
              time: new Date(orderData.orderDate).toLocaleTimeString(),
            },
            {
              status: "Shipped",
              icon: <FaShippingFast />,
              color:
                orderData.orderStatusName.toLowerCase() !== "order is placed"
                  ? "green"
                  : "gray",
              date: null,
              time: null,
            },
            {
              status: "Out for Delivery",
              icon: <FaTruck />,
              color:
                orderData.orderStatusName.toLowerCase() ===
                  "out for delivery" ||
                orderData.orderStatusName.toLowerCase() === "delivered"
                  ? "green"
                  : "gray",
              date: null,
              time: null,
            },
            {
              status: "Delivered",
              icon: <FaBox />,
              color:
                orderData.orderStatusName.toLowerCase() === "delivered"
                  ? "green"
                  : "gray",
              date: null,
              time: null,
            },
          ];

          switch (orderData.orderStatusName.toLowerCase()) {
            case "shipped":
              statusTimeline[1].date = new Date(
                orderData.statusDate
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
              statusTimeline[1].time = new Date(
                orderData.statusDate
              ).toLocaleTimeString();
              break;
            case "out for delivery":
              statusTimeline[1].date = new Date(
                orderData.statusDate
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
              statusTimeline[1].time = new Date(
                orderData.statusDate
              ).toLocaleTimeString();
              statusTimeline[2].date = new Date(
                orderData.statusDate
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
              statusTimeline[2].time = new Date(
                orderData.statusDate
              ).toLocaleTimeString();
              break;
            case "delivered":
              statusTimeline[1].date = new Date(
                orderData.statusDate
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
              statusTimeline[1].time = new Date(
                orderData.statusDate
              ).toLocaleTimeString();
              statusTimeline[2].date = new Date(
                orderData.statusDate
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
              statusTimeline[2].time = new Date(
                orderData.statusDate
              ).toLocaleTimeString();
              statusTimeline[3].date = new Date(
                orderData.statusDate
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
              statusTimeline[3].time = new Date(
                orderData.statusDate
              ).toLocaleTimeString();
              break;
            default:
              break;
          }

          const transformedOrderDetails = {
            arrivingDate: new Date(orderData.estimatedDate).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            ),
            statusTimeline,
            shippingAddress: {
              customerName: orderData.customerName,
              flatNo: orderData.flatNo,
              area: orderData.area,
              city: orderData.city,
              stateName: orderData.stateName,
              pinCode: orderData.pinCode,
              country: orderData.country,
            },
          };

          setOrderDetails(transformedOrderDetails);
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      }
    };

    fetchOrderDetails();
  }, []);

  const handleViewOrderDetails = () => {
    navigate("/orderDetails");
  };

  const toggleAddressVisibility = () => {
    setAddressVisible(!addressVisible);
  };

  return (
    <div className="track-order">
      <div className="header">
        <h1>Track Order Delivery</h1>
      </div>

      {orderDetails && (
        <div className="order-details">
          <div className="arriving-date">
            <h3>ARRIVING DATE</h3>
            <p>{orderDetails.arrivingDate}</p>
          </div>
          <div className="shipping-address-box">
            <h3>Shipping Address</h3>
            <button
              className="toggle-address-button"
              onClick={toggleAddressVisibility}
            >
              {addressVisible ? "▲" : "▼"} Address
            </button>
            {addressVisible && orderDetails.shippingAddress && (
              <div className="address-details">
                <p>
                  <b>Cust Name:</b> {orderDetails.shippingAddress.customerName}
                </p>
                <p>
                  <b>Flat No:</b> {orderDetails.shippingAddress.flatNo}
                </p>
                <p>
                  <b>Area:</b> {orderDetails.shippingAddress.area}
                </p>
                <p>
                  <b>City:</b> {orderDetails.shippingAddress.city}
                </p>
                <p>
                  <b>State Name:</b> {orderDetails.shippingAddress.stateName}
                </p>
                <p>
                  <b>Pin Code:</b> {orderDetails.shippingAddress.pinCode}
                </p>
                <p>
                  <b>Country:</b> {orderDetails.shippingAddress.country}
                </p>
              </div>
            )}
          </div>
          <div className="timeline-container">
            {orderDetails.statusTimeline.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="circle-wrapper">
                  <div className={`circle ${item.color}`}>{item.icon}</div>
                  {index < orderDetails.statusTimeline.length - 1 && (
                    <div
                      className="line"
                      style={{ backgroundColor: item.color }}
                    ></div>
                  )}
                </div>
                <div className="timeline-content">
                  <p>{item.status}</p>
                  {item.date && (
                    <p>
                      <b>Date:</b> {item.date}
                    </p>
                  )}
                  {item.time && (
                    <p>
                      <b>Time:</b> {item.time}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            className="view-order-details"
            onClick={handleViewOrderDetails}
          >
            View Order Details
          </button>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;