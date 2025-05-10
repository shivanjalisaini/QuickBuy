import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { getDiscountedProducts } from "../../../services/ApiService";
import { useNavigate } from "react-router-dom";
import "./DiscountedProducts.css";

const calculateDiscountPercentage = (actualPrice, discountedPrice) => {
  const discount = actualPrice - discountedPrice;
  return Math.round((discount / actualPrice) * 100);
};

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {Array.from({ length: fullStars }, (_, index) => (
        <StarIcon key={index} style={{ color: "gold" }} />
      ))}
      {halfStar && <StarHalfIcon style={{ color: "gold" }} />}
      {Array.from({ length: emptyStars }, (_, index) => (
        <StarOutlineIcon key={index} style={{ color: "gold" }} />
      ))}
    </>
  );
};

const DiscountedProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3;
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const response = await getDiscountedProducts();
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching discounted products:", error);
      }
    };

    fetchDiscountedProducts();
  }, []);

  const handleCardClick = (productId) => {
    localStorage.setItem("selectedProductId", productId);
    navigate(`/product/${productId}`);
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsToShow, 0));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + itemsToShow, products.length - itemsToShow)
    );
  };

  return (
    <Box className="discounted-products-section1">
      <Typography variant="h4" component="div" align="center" gutterBottom>
        Discounted Products
      </Typography>
      <Box className="discounted-slider-controls1">
        <Button
          className="discounted-slider-button1"
          onClick={handlePrevClick}
          disabled={currentIndex === 0}
        >
          &lt;
        </Button>
        <Grid
          container
          spacing={2}
          className="discounted-products-list1"
          ref={containerRef}
        >
          {products
            .slice(currentIndex, currentIndex + itemsToShow)
            .map((product) => (
              <Grid item xs={12} sm={4} md={4} key={product.productId}>
                <Card
                  className="discounted-product-card1"
                  onClick={() => handleCardClick(product.productId)}
                >
                  <div className="discounted-product-horizontal-layout1">
                    <div className="discounted-product-image-wrapper1">
                      <img
                        src={`data:image/jpeg;base64,${product.imagePaths}`}
                        alt={product.productName}
                        className="discounted-product-image1"
                      />
                    </div>
                    <CardContent className="discounted-product-info1">
                      <Typography
                        variant="h6"
                        component="div"
                        className="discounted-product-title1"
                      >
                        {product.productName}
                      </Typography>
                      <Box className="discounted-product-rating1">
                        {renderStars(product.averageRatingStar)}
                        <Typography
                          variant="body1"
                          className="discounted-product-rating-value1"
                        ></Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        className="discounted-product-price-current1"
                      >
                        ₹ {product.priceAfterDiscount} &nbsp;
                        <span className="discounted-product-discount1">
                          -
                          {calculateDiscountPercentage(
                            product.productPrice,
                            product.priceAfterDiscount
                          )}
                          %
                        </span>
                      </Typography>
                      <Typography
                        variant="body1"
                        className="discounted-product-price-original1"
                      >
                        <strong>
                          {" "}
                          <s>₹ {product.productPrice}</s>{" "}
                        </strong>
                      </Typography>
                    </CardContent>
                  </div>
                </Card>
              </Grid>
            ))}
        </Grid>
        <Button
          className="discounted-slider-button1"
          onClick={handleNextClick}
          disabled={currentIndex >= products.length - itemsToShow}
        >
          &gt;
        </Button>
      </Box>
      <Box display="flex" justifyContent="center" marginTop={1.5}>
        <Button
          href="allDiscountedProducts"
          className="discounted-see-more-button1"
          variant="text"
        >
          See More
        </Button>
      </Box>
    </Box>
  );
};

export default DiscountedProducts;