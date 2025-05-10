import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCartByUserId,
  deleteProductFromCart,
  updateCartItem,
} from "../../services/ApiService";
import { FaPlus, FaMinus } from "react-icons/fa";
import { CartContext } from "../../components/ShoppingCart/CartContext";
import "./ShoppingCart.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const { setCartCount } = useContext(CartContext);

  useEffect(() => {
    const fetchCartData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/signin");
        return;
      }

      try {
        const response = await getCartByUserId(userId);
        const allCartIds = response.items.map((item) => item.cartId);
        setCartItems(response.items);

        const storedSelectedItems =
          JSON.parse(localStorage.getItem("selectedItems")) || [];
        const validSelectedItems = storedSelectedItems.filter((id) =>
          allCartIds.includes(id)
        );
        setSelectedItems(validSelectedItems);
        calculateTotal(response.items, validSelectedItems);

        const totalItems = response.items.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        setCartCount(totalItems);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, [navigate, setCartCount]);

  const calculateTotal = (items, selectedIds) => {
    const totalAmount = items.reduce(
      (acc, item) =>
        selectedIds.includes(item.cartId)
          ? acc + item.priceAfterDiscount * item.quantity
          : acc,
      0
    );
    setTotal(totalAmount);
  };

  const handleQuantityChange = async (index, delta) => {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity += delta;

    if (newCartItems[index].quantity > 5) {
      toast.error("Quantity should be less than 5.");
      return;
    }

    if (newCartItems[index].quantity < 1) {
      await handleRemove(
        newCartItems[index].cartId,
        newCartItems[index].productId,
        index
      );
      return;
    }

    try {
      await updateCartItem(
        newCartItems[index].cartId,
        newCartItems[index].productId,
        newCartItems[index].quantity
      );
      setCartItems(newCartItems);
      calculateTotal(newCartItems, selectedItems);
      const totalItems = newCartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      setCartCount(totalItems);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemove = async (cartId, productId, index) => {
    try {
      await deleteProductFromCart(cartId, productId);
      toast.success("Item Removed From Cart Successfully");
      const newCartItems = [...cartItems];
      newCartItems.splice(index, 1);
      setCartItems(newCartItems);
      const updatedSelectedItems = selectedItems.filter((id) =>
        newCartItems.some((item) => item.cartId === id)
      );
      setSelectedItems(updatedSelectedItems);
      calculateTotal(newCartItems, updatedSelectedItems);
      const totalItems = newCartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      setCartCount(totalItems);

      localStorage.setItem(
        "selectedItems",
        JSON.stringify(updatedSelectedItems)
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleCheckboxChange = (cartId) => {
    const updatedSelectedItems = selectedItems.includes(cartId)
      ? selectedItems.filter((id) => id !== cartId)
      : [...selectedItems, cartId];

    setSelectedItems(updatedSelectedItems);
    calculateTotal(cartItems, updatedSelectedItems);

    localStorage.setItem("selectedItems", JSON.stringify(updatedSelectedItems));
  };

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to proceed.");
      return;
    }

    localStorage.setItem("isSingleProduct", "false");
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    navigate("/shippingAddress");
  };

  return (
    <div className="shopping-cart-container">
      <div className="shopping-cart-details">
        <h2 className="shopping-cart-heading">Shopping Cart</h2>
        {cartItems.map((item, index) => (
          <div key={item.productId} className="shopping-cart-product-card">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.cartId)}
              onChange={() => handleCheckboxChange(item.cartId)}
              className="shopping-cart-checkbox"
            />
            <img
              src={`data:image/jpeg;base64,${item.productImages[0]}`}
              alt={item.productName}
              className="shopping-cart-product-image"
            />
            <div className="shopping-cart-card-details">
              <h3 className="shopping-cart-product-name">{item.productName}</h3>
              <p className="shopping-cart-product-description">
                {item.productShortDescription}
              </p>
              <div className="shopping-cart-quantity-controls">
                <button
                  className="shopping-cart-quantity-button"
                  onClick={() => handleQuantityChange(index, -1)}
                >
                  <FaMinus />
                </button>
                <span className="shopping-cart-quantity">{item.quantity}</span>
                <button
                  className="shopping-cart-quantity-button"
                  onClick={() => handleQuantityChange(index, 1)}
                >
                  <FaPlus />
                </button>
              </div>
              <p className="shopping-cart-product-price">
                ₹ {item.priceAfterDiscount}
              </p>
              <button
                className="shopping-cart-remove-button"
                onClick={() => handleRemove(item.cartId, item.productId, index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="shopping-cart-price-summary">
          <div className="shopping-cart-price-direction">
            <h3 className="shopping-cart-price-summary-heading">Total Price</h3>
            <div className="shopping-cart-summary-item shopping-cart-total">
              {/* <span>Total</span> */}
              <span>₹ {total.toFixed(2)}</span>
            </div>
          </div>
          <button
            className="shopping-cart-continue-button"
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </button>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;