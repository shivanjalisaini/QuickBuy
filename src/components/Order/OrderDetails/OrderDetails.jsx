import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getOrderDetails } from "../../../services/ApiService";
import quickbuylogo from "../../../assests/quickbuylogo.png";
import "./OrderDetails.css";

const OrderDetails = ({ orderId }) => {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const storedOrderId = localStorage.getItem("orderId");
        const response = await getOrderDetails(storedOrderId || orderId);
        setOrderDetails(response);
      } catch (error) {
        console.error("Failed to fetch order details", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const downloadInvoice = () => {
    const doc = new jsPDF("p", "mm", "a4");

    html2canvas(document.querySelector(".order-details-page")).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position -= pageHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        doc.save("invoice.pdf");
      }
    );
  };

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-details-page">
      <div className="order-details-container">
        <div className="order-details-header">
          <div className="header-left">
            <img
              src={quickbuylogo}
              alt="Company Logo"
              className="company-logo"
            />
            <div className="order-id">
              <h5>Order ID:</h5>
              <p>{orderDetails?.orderId || "N/A"}</p>
            </div>
            <div className="order-date">
              <h5>Order Date:</h5>
              <p>
                {orderDetails?.orderDate
                  ? new Date(orderDetails.orderDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="header-right">
            <div className="invoice-label">INVOICE</div>
          </div>
        </div>
        <hr className="separator-line" />
        <div className="order-details-info">
          <div className="info-item">
            <h3>Payment Option:</h3>
            <p>{orderDetails?.paymentMode || "N/A"}</p>
          </div>
          <div className="info-item">
            <h3>Order Total:</h3>
            <p>₹{orderDetails?.orderTotalValue?.toFixed(2) || "N/A"}</p>
          </div>
        </div>

        <div className="final-values-section">
          <div className="final-values-row">
            <h3>Order Value:</h3>
            <p>₹{orderDetails?.orderAmount?.toFixed(2) || "N/A"}</p>
          </div>
          <div className="final-values-row">
            <h3>Total Tax Paid:</h3>
            <p>₹{orderDetails?.totalTaxesPaid?.toFixed(2) || "N/A"}</p>
          </div>
          <div className="final-values-row">
            <h3>Shipping Charge:</h3>
            <p>₹{orderDetails?.shippingCharges?.toFixed(2) || "N/A"}</p>
          </div>
          <div className="final-values-row">
            <h3>SGST:</h3>
            <p>₹{orderDetails?.sgst?.toFixed(2) || "N/A"}</p>
          </div>
          <div className="final-values-row">
            <h3>CGST:</h3>
            <p>₹{orderDetails?.cgst?.toFixed(2) || "N/A"}</p>
          </div>
        </div>
        <button className="download-invoice-button" onClick={downloadInvoice}>
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;