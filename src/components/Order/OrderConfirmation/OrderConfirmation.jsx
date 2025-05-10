import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAddressById,
  getRecentOrders,
  cancelOrder,
} from "../../../services/ApiService";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedAddress, setAddresses] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      const addressId = localStorage.getItem("selectedAddressId");
      const userId = localStorage.getItem("userId");
      if (!addressId) {
        console.error("Address ID not found in local storage");
        return;
      }
      try {
        const addressResponse = await getAddressById(addressId);
        setAddresses(addressResponse.data);

        const orderResponse = await getRecentOrders(userId);
        setOrderDetails(orderResponse.orderItems);
        localStorage.setItem("orderId", orderResponse.orderId);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    fetchDetails();
  }, []);

  const handleTrackOrder = () => {
    navigate("/trackOrder");
  };

  const handleChangeAddress = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleNavigateToAddressPage = () => {
    setShowPopup(false);
    navigate("/shippingAddress");
  };

  const handleCancelOrder = async (orderItemId) => {
    try {
      const orderId = localStorage.getItem("orderId");
      const data = { orderStatusId: 5 };
      await cancelOrder(orderId, data);
      setOrderDetails(
        orderDetails.filter((item) => item.orderItemId !== orderItemId)
      );
      console.log(`Order with orderItemId: ${orderItemId} has been canceled.`);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    navigate("/landingPage");
  };

  return (
    <div className="order-confirmation-container">
      <div className="order-confirmation-icon">&#10004;</div>
      <h2>Order Placed Successfully!</h2>
      <div className="order-confirmation-section order-confirmation-shipping-address-section">
        <h3>
          Shipping Address
          <button
            onClick={handleChangeAddress}
            className="order-confirmation-change-address-button"
          >
            Change Address
          </button>
        </h3>
        {selectedAddress ? (
          <div className="address-details">
            <p>
              <b>Cust Name:</b> {selectedAddress.custName}
            </p>
            <p>
              <b>Mobile No:</b> {selectedAddress.mobileNo}
            </p>
            <p>
              <b>Flat No:</b> {selectedAddress.flatNo}
            </p>
            <p>
              <b>Area:</b> {selectedAddress.area}
            </p>
            <p>
              <b>City:</b> {selectedAddress.city}
            </p>
            <p>
              <b>State Name:</b> {selectedAddress.stateName}
            </p>
            <p>
              <b>Pin Code:</b> {selectedAddress.pinCode}
            </p>
            <p>
              <b>Country:</b> {selectedAddress.country}
            </p>
          </div>
        ) : (
          <p>No address selected.</p>
        )}
      </div>
      <div className="order-confirmation-section">
        <h3>Your Order</h3>
        {orderDetails.map((item, index) => (
          <div key={index} className="order-confirmation-order-item">
            <p>
              <b>Product Name:</b> {item.productName}
            </p>
            <p>
              <b>Quantity:</b> {item.quantity}
            </p>
            <p>
              <b>Price:</b> ₹{item.unitPrice}
            </p>
            <img
              src={`data:image/jpeg;base64,${item.productImage}`}
              alt={item.productName}
              className="product-image"
            />
            <button
              onClick={() => handleCancelOrder(item.orderItemId)}
              className="order-confirmation-cancel-button"
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleTrackOrder}
        className="order-confirmation-track-order-button"
      >
        Track Your Order
      </button>

      {showPopup && (
        <div className="order-confirmation-popup-overlay">
          <div className="order-confirmation-popup-content">
            <h4>Change Address</h4>
            <p>Are you sure you want to update your address?</p>
            <button
              onClick={handlePopupClose}
              className="order-confirmation-popup-close-button"
            >
              Cancel
            </button>
            <button
              onClick={handleNavigateToAddressPage}
              className="order-confirmation-popup-confirm-button"
            >
              Go to Address Page
            </button>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="order-confirmation-popup-overlay">
          <div className="order-confirmation-popup-content">
            <h4>Order Cancelled</h4>
            <p>Your order has been cancelled successfully.</p>
            <button
              onClick={handleSuccessPopupClose}
              className="order-confirmation-popup-close-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;