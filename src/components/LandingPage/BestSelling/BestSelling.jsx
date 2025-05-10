import React, { useState, useEffect } from "react";
import { getBestSelling } from "../../../services/ApiService";
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
import { useNavigate } from "react-router-dom";
import "./BestSelling.css";

const BestSelling = () => {
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await getBestSelling();
        setBestSellerProducts(response.data);
      } catch (error) {
        console.error("Error fetching best selling products:", error);
      }
    };

    fetchBestSellers();
  }, []);

  const handleCardClick = (productId) => {
    localStorage.setItem("selectedProductId", productId);
    navigate(`/product/${productId}`);
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

  return (
    <Box className="best-selling-container">
      <Typography variant="h4" component="div" align="center" gutterBottom>
        Best Selling Products
      </Typography>
      <Grid container spacing={2} className="best-selling-grid">
        {bestSellerProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.productId}>
            <Card
              className="best-selling-card"
              onClick={() => handleCardClick(product.productId)}
            >
              <div className="bestSelling-image-container">
                <img
                  src={`data:image/jpeg;base64,${product.imagePaths}`}
                  alt={product.productName}
                  className="best-selling-image"
                />
              </div>
              <CardContent className="best-selling-content">
                <Typography
                  variant="h6"
                  component="div"
                  className="best-selling-name"
                >
                  {product.productName}
                </Typography>
                <Box className="best-selling-rating">
                  {renderStars(product.averageRatingStar)}
                  <Typography
                    variant="body1"
                    className="best-selling-rating-value"
                  ></Typography>
                </Box>
                <Typography variant="body1" className="best-selling-price">
                  ₹ {product.priceAfterDiscount.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Button
          href="allBestSelling"
          className="best-selling-button"
          variant="text"
        >
          See More
        </Button>
      </Box>
    </Box>
  );
};

export default BestSelling;