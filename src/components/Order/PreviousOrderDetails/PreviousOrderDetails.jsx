import React, { useEffect, useState } from "react";
import {
  getSingleProduct,
  getOrderDetails,
} from "../../../services/ApiService";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaShareAlt,
  FaWhatsapp,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";
import "./PreviousOrderDetails.css";

const PreviousOrderDetails = () => {
  const { orderId, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const storedProductId = localStorage.getItem("productId") || productId;
        const productData = await getSingleProduct(storedProductId);
        setProduct(productData);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };

    const fetchOrderDetails = async () => {
      try {
        const storedOrderId = localStorage.getItem("orderId") || orderId;
        const orderData = await getOrderDetails(storedOrderId);
        setOrderDetails(orderData);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      }
    };

    fetchProductDetails();
    fetchOrderDetails();
  }, [productId, orderId]);

  const handleShare = (platform) => {
    const url = window.location.href;
    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank");
        break;
      case "instagram":
        alert("Instagram sharing is not directly supported from the web.");
        break;
      case "email":
        window.location.href = `mailto:?subject=Check out this product&body=${encodeURIComponent(
          url
        )}`;
        break;
      default:
        break;
    }
    setShowShareMenu(false);
  };

  const handleWriteReview = () => {
    navigate("/addProductReview");
  };

  const handleTrackOrder = () => {
    navigate("/trackOrder");
  };

  if (!product || !orderDetails) {
    return <p>Loading...</p>;
  }

  const isDelivered = orderDetails.orderStatus.toLowerCase() === "delivered";
  const isCanceled = orderDetails.orderStatus.toLowerCase() === "cancelled";

  return (
    <div className="product-details-container">
      <h1>{product.productName}</h1>
      <div className="image-container">
        <img
          src={`data:image/jpeg;base64,${product.productImages[0]}`}
          alt={product.productName}
          className="modal-product-image"
        />
        <div className="share-container">
          <FaShareAlt
            className="share-icon"
            onClick={() => setShowShareMenu(!showShareMenu)}
          />
          {showShareMenu && (
            <div className="share-menu">
              <FaWhatsapp
                onClick={() => handleShare("whatsapp")}
                className="share-option"
                title="Share on WhatsApp"
              />
              <FaInstagram
                onClick={() => handleShare("instagram")}
                className="share-option"
                title="Share on Instagram"
              />
              <FaEnvelope
                onClick={() => handleShare("email")}
                className="share-option"
                title="Share via Email"
              />
            </div>
          )}
        </div>
      </div>
      <div className="product-info">
        {isCanceled ? (
          <p className="modal-cancelled-status">
            Canceled on{" "}
            {new Date(orderDetails.orderStatusDate).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            )}
          </p>
        ) : (
          <p className="modal-delivery-status">
            {isDelivered
              ? `Delivered on ${new Date(
                  orderDetails.orderDeliveredDate
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}`
              : `Delivering on ${new Date(
                  orderDetails.orderEstimatedDate
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}`}
          </p>
        )}
      </div>
      {!isCanceled && (
        <div className="review-actions">
          {isDelivered ? (
            <button className="write-review-button" onClick={handleWriteReview}>
              Write Review
            </button>
          ) : (
            <button className="track-order-button" onClick={handleTrackOrder}>
              Track Order
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PreviousOrderDetails;