import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ConfirmOrder.css";
import {
  getAddressById,
  getCartByUserId,
  placeOrder,
  getSingleProduct,
  deleteCart,
  deleteProductFromCart,
} from "../../../services/ApiService";
import CheckoutNavbar from "../../CheckoutNavbar/CheckoutNavbar";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [billingAddressSame, setBillingAddressSame] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [orderSummary, setOrderSummary] = useState({
    items: 0,
    shipping: 0,
    gst: 0,
    total: 0,
  });
  const [isSingleProduct, setIsSingleProduct] = useState(false);
  const [addressVisible, setAddressVisible] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      const addressId = localStorage.getItem("selectedAddressId");
      if (!addressId) {
        console.error("Address ID not found in local storage");
        return;
      }

      try {
        const response = await getAddressById(addressId);
        setSelectedAddress(response.data);
      } catch (error) {
        console.error("Error fetching address details:", error);
      }

      const singleProductFlag =
        localStorage.getItem("isSingleProduct") === "true";
      setIsSingleProduct(singleProductFlag);

      if (singleProductFlag) {
        const singleProductId = localStorage.getItem("selectedProductId");
        const quantity = localStorage.getItem("quantity");

        try {
          const response = await getSingleProduct(singleProductId);
          const product = response;
          const productTotal = product.priceAfterDiscount * quantity;
          const gst = product.totalTax * quantity;
          const shipping = product.shippingCharge;
          const total = productTotal + gst + shipping;

          setOrderSummary({
            items: productTotal,
            gst,
            shipping,
            total,
          });
        } catch (error) {
          console.error("Error fetching single product details:", error);
        }
      } else {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found in local storage");
          return;
        }

        try {
          const response = await getCartByUserId(userId);
          const selectedItems =
            JSON.parse(localStorage.getItem("selectedItems")) || [];
          const filteredItems = response.items.filter((item) =>
            selectedItems.includes(item.cartId)
          );
          setCartItems(filteredItems);
          calculateOrderSummary(filteredItems);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      }
    };

    fetchDetails();
  }, []);

  const calculateOrderSummary = (items) => {
    const itemsTotal = items.reduce(
      (total, item) => total + item.priceAfterDiscount * item.quantity,
      0
    );
    const gst = items.reduce(
      (total, item) => total + item.totalTax * item.quantity,
      0
    );
    const shipping = items.length > 0 ? items[0].shippingCharge : 0;
    const total = itemsTotal + gst + shipping;

    setOrderSummary({
      items: itemsTotal,
      gst,
      shipping,
      total,
    });
  };

  const handleBillingAddressToggle = () => {
    setBillingAddressSame(!billingAddressSame);
  };

  const handlePlaceOrder = async () => {
    const userId = localStorage.getItem("userId");
    const addressId = localStorage.getItem("selectedAddressId");

    const orderItems = isSingleProduct
      ? [
          {
            productId: localStorage.getItem("selectedProductId"),
            quantity: localStorage.getItem("quantity"),
          },
        ]
      : cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));

    const orderDetails = {
      userId: parseInt(userId, 10),
      addressId: parseInt(addressId, 10),
      orderAmount: orderSummary.total,
      orderItems,
    };

    try {
      const response = await placeOrder(orderDetails);
      console.log("Order placed successfully:", response);

      if (!isSingleProduct) {
        const allCartItems = await getCartByUserId(userId);
        const allCartIds = allCartItems.items.map((item) => item.cartId);
        const selectedCartIds = cartItems.map((item) => item.cartId);

        if (allCartIds.length === selectedCartIds.length) {
          await deleteCart(userId);
          console.log("Cart cleared after order placement.");
        } else {
          for (const item of cartItems) {
            await deleteProductFromCart(item.cartId, item.productId);
            console.log(`Item ${item.productId} deleted from cart.`);
          }
        }
      }

      localStorage.removeItem("isSingleProduct");
      localStorage.removeItem("quantity");
      navigate("/orderConfirmation");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const toggleAddressVisibility = () => {
    setAddressVisible(!addressVisible);
  };

  const handleCancelOrder = () => {
    setShowCancelPopup(true);
  };

  const confirmCancelOrder = () => {
    setShowCancelPopup(false);
    setCartItems([]);
    setOrderSummary({ items: 0, shipping: 0, gst: 0, total: 0 });
    localStorage.removeItem("selectedProductId");
    localStorage.removeItem("quantity");
    localStorage.removeItem("isSingleProduct");
    navigate("/landingPage");
  };

  return (
    <div className="confirm-order-page1">
      <CheckoutNavbar />
      <h2>Confirm Your Order</h2>

      <div className="section1">
        <h3>Shipping Address</h3>
        <button
          className="toggle-address-button"
          onClick={toggleAddressVisibility}
        >
          {addressVisible ? "▲" : "▼"} Address
        </button>
        {addressVisible && selectedAddress && (
          <div className="address-details1">
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
        )}
      </div>

      <div className="section1">
        <h3>Billing Address</h3>
        <label>
          <input
            type="checkbox"
            checked={billingAddressSame}
            onChange={handleBillingAddressToggle}
          />
          Billing address is the same as shipping address
        </label>
      </div>

      <div className="section1">
        <h3>Payment Method</h3>
        <p>Cash on Delivery</p>
      </div>

      <div className="section1">
        <h3>Order Summary</h3>
        <div className="order-summary1">
          <div className="order-item1">
            <span>Items:</span>
            <span> ₹{orderSummary.items.toFixed(2)}</span>
          </div>
          <div className="order-item1">
            <span>Shipping:</span>
            <span> ₹{orderSummary.shipping.toFixed(2)}</span>
          </div>
          <div className="order-item1">
            <span>Estimated GST:</span>
            <span> ₹{orderSummary.gst.toFixed(2)}</span>
          </div>
          <div className="order-total1">
            <span>Order Total:</span>
            <span> ₹{orderSummary.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="actions1">
        <button className="place-order-button1" onClick={handlePlaceOrder}>
          Place Your Order
        </button>
        <button className="cancel-order-button1" onClick={handleCancelOrder}>
          Cancel Order
        </button>
      </div>

      {showCancelPopup && (
        <div className="popup1">
          <div className="popup-content1">
            <p>Are you sure you want to cancel the order?</p>
            <button onClick={confirmCancelOrder}>Yes</button>
            <button onClick={() => setShowCancelPopup(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmOrder;