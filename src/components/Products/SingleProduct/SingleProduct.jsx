import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress, Alert } from "@mui/material";
import {
  getSingleProduct,
  createCart,
  getCartByUserId,
  updateCartItem,
} from "../../../services/ApiService";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./SingleProduct.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SingleProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getSingleProduct(productId);
        setProduct(response);
      } catch (error) {
        setError("Error fetching product: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

 const handleQuantityChange = (amount) => {
   setQuantity((prevQuantity) => {
     const newQuantity = prevQuantity + amount;
     if (newQuantity > 5) {
       toast.error("Quantity should be less than 5.");
       return prevQuantity; 
     }
     return Math.max(1, newQuantity);
   });
 };

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/signin");
      return;
    }

    try {
      const cartResponse = await getCartByUserId(userId);

      const existingCartItem = cartResponse.items.find(
        (item) => Number(item.productId) === Number(productId)
      );

      if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + quantity;
        await updateCartItem(existingCartItem.cartId, productId, newQuantity);
        console.log("Cart item quantity updated successfully");
        toast.success("Item updated in the cart successfully.");
      } else {
        const response = await createCart(userId, productId, quantity);
        console.log("Cart added successfully:", response);
        toast.success("Item added to the cart successfully.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error.message);
    }
  };

  const handleBuy = async () => {
    localStorage.setItem("isSingleProduct", "true");
    localStorage.setItem("quantity", quantity);
    navigate("/shippingAddress");
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!product) {
    return null;
  }

  return (
    <div className="single-product-page">
      <div className="single-product-container">
        <div className="image-gallery">
          {product.productImages.map((image, index) => (
            <img
              key={index}
              src={`data:image/jpeg;base64,${image}`}
              alt={`Product ${index + 1}`}
              className="gallery-image"
            />
          ))}
        </div>
        <img
          src={`data:image/jpeg;base64,${product.productImages[0]}`}
          alt={product.productName}
          className="single-product-image"
        />
        <div className="single-product-details">
          <h1>{product.productName}</h1>
          <p className="single-product-mrp">
            <span className="line-through">₹{product.mrp}</span>{" "}
            <span className="discounted-price">
              ₹{product.priceAfterDiscount}
            </span>{" "}
            <span className="discount-percentage">
              -{product.productDiscount}%
            </span>
          </p>
          <div className="single-product-quantity">
            <button onClick={() => handleQuantityChange(-1)}>
              <FaMinus />
            </button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange(1)}>
              <FaPlus />
            </button>
          </div>
          <p className="single-product-short-description">
            {product.productShortDescription}
          </p>
          <button className="add-to-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="buy-now" onClick={handleBuy}>
            Buy Now
          </button>
        </div>
      </div>

      <div className="tabs">
        <div
          className={`tab ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Product Details
        </div>
        <div
          className={`tab ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          Review Rating
        </div>
      </div>

      <div className="tab-content">
        {activeTab === "details" ? (
          <div className="product-details-container1">
            <p className="single-product-detail-description">
              {product.productDetailDescription}
            </p>
          </div>
        ) : (
          <div className="single-product-reviews">
            {product.reviews.map((review, index) => (
              <div key={index} className="single-product-review">
                <p>{review.userName}</p>
                <div className="single-product-review-stars">
                  {[...Array(review.ratingStar)].map((_, starIndex) => (
                    <span key={starIndex} className="filled">
                      &#9733;
                    </span>
                  ))}
                </div>
                <p>{review.reviewComment}</p>
              </div>
            ))}
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default SingleProduct;