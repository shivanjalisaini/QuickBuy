import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import WatchIcon from "@mui/icons-material/Watch";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import hotdeal from "../../../assests/HotDeals.jpeg";
import { getAllBestSelling } from "../../../services/ApiService";
import "./HotDeals.css";

const HotDeals = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [hotDealsProducts, setHotDealsProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerPage = 4;
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotDeals = async () => {
      try {
        const response = await getAllBestSelling();
        setHotDealsProducts(response.data.slice(0, 10));
      } catch (error) {
        setError("Error fetching hot deals products: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotDeals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft =
        currentIndex *
        (containerRef.current.scrollWidth / hotDealsProducts.length);
    }
  }, [currentIndex, hotDealsProducts.length]);

  function calculateTimeLeft() {
    const difference = +new Date("2024-12-31") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  const scrollLeft = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - productsPerPage, 0));
  };

  const scrollRight = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(
        prevIndex + productsPerPage,
        hotDealsProducts.length - productsPerPage
      )
    );
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

  const handleCardClick = (productId) => {
    localStorage.setItem("selectedProductId", productId);
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const visibleProducts = hotDealsProducts.slice(
    currentIndex,
    currentIndex + productsPerPage
  );

  return (
    <>
      <div className="hot-deals-title-container">
        <Typography variant="h4" component="h3" className="hot-deals-title">
          HOT DEALS! GET OUR BEST PRICES
        </Typography>
        <div className="hot-deals-timer-section">
          <WatchIcon className="hot-deals-timer-icon" />
          <div className="hot-deals-timer">
            <span>{timeLeft.days}d</span>
            <span>{timeLeft.hours}h</span>
            <span>{timeLeft.minutes}m</span>
            <span>{timeLeft.seconds}s</span>
          </div>
        </div>
      </div>
      <Container className="hot-deals-container">
        <Box className="hot-deals-content">
          <div className="hot-deals-left-image">
            <img src={hotdeal} alt="Hot Deals" />
          </div>
          <Box className="hot-deals-slider">
            <Button
              onClick={scrollLeft}
              className="hot-deals-scroll-button"
              disabled={currentIndex === 0}
            >
              <ArrowBackIcon />
            </Button>
            <div className="hot-deals-products" ref={containerRef}>
              {visibleProducts.map((product) => (
                <Card
                  className="hot-deals-product-card"
                  key={product.productId}
                  onClick={() => handleCardClick(product.productId)}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={
                      Array.isArray(product.imagePaths)
                        ? `data:image/jpeg;base64,${product.imagePaths[0]}`
                        : `data:image/jpeg;base64,${product.imagePaths}`
                    }
                    alt={product.name}
                    className="hot-deals-product-image"
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      className="hot-deals-product-name"
                    >
                      {product.name}
                    </Typography>
                    <div className="hot-deals-product-rating">
                      {renderStars(product.averageRatingStar)}
                    </div>
                    <Typography
                      variant="body1"
                      className="hot-deals-product-price"
                    >
                      ₹ {product.priceAfterDiscount.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              onClick={scrollRight}
              className="hot-deals-scroll-button"
              disabled={
                currentIndex + productsPerPage >= hotDealsProducts.length
              }
            >
              <ArrowForwardIcon />
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default HotDeals;