import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { getAllDiscountedProducts } from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import Filters from "../Filters/Filters";
import "./AllDiscountedProducts.css";

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

const AllDiscountedProducts = () => {
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({
    rating: 0,
    priceRange: [0, Infinity],
    discount: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllDiscountedProducts();
        setDiscountedProducts(data.data);
      } catch (error) {
        setError("Error fetching discounted products: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCardClick = (productId) => {
    localStorage.setItem("selectedProductId", productId);
    navigate(`/product/${productId}`);
  };

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleSortOrder = (order) => {
    setSortOrder(order);
    setDiscountedProducts(
      [...discountedProducts].sort((a, b) => {
        if (order === "asc") {
          return a.productName.localeCompare(b.productName);
        } else {
          return b.productName.localeCompare(a.productName);
        }
      })
    );
    handleSortClose();
  };

  const handleFilterChange = (type, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [type]: value }));
  };

  const filteredProducts = discountedProducts.filter((product) => {
    const { rating, priceRange, discount } = filters;
    const productDiscount = calculateDiscountPercentage(
      product.productPrice,
      product.priceAfterDiscount
    );
    return (
      product.averageRatingStar >= rating &&
      product.priceAfterDiscount >= priceRange[0] &&
      product.priceAfterDiscount <= priceRange[1] &&
      productDiscount >= discount
    );
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container className="discounted-products-container">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={3} className="filter-container">
          <Filters onFilterChange={handleFilterChange} showDiscounts={true} />
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <Typography
            variant="h4"
            component="h2"
            className="discounted-products-title"
            align="center"
            gutterBottom
          >
            All Discounted Products
          </Typography>
          <div className="sort-button">
            <IconButton
              aria-controls="sort-menu"
              aria-haspopup="true"
              onClick={handleSortClick}
            >
              <SortIcon />
            </IconButton>
          </div>
          <Menu
            id="sort-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleSortClose}
          >
            <MenuItem onClick={() => handleSortOrder("asc")}>
              Ascending
            </MenuItem>
            <MenuItem onClick={() => handleSortOrder("desc")}>
              Descending
            </MenuItem>
          </Menu>
          <Grid container spacing={4}>
            {filteredProducts.map((product) => (
              <Grid item key={product.productId} xs={12} sm={4} md={4}>
                <Card
                  className="discounted-product-card"
                  onClick={() => handleCardClick(product.productId)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      Array.isArray(product.imagePaths)
                        ? `data:image/jpeg;base64,${product.imagePaths[0]}`
                        : `data:image/jpeg;base64,${product.imagePaths}`
                    }
                    alt={product.productName}
                    className="discounted-product-image"
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      className="discounted-product-name"
                    >
                      {product.productName}
                    </Typography>
                    <div className="discounted-product-rating">
                      {renderStars(product.averageRatingStar)}
                      <Typography
                        variant="body1"
                        className="discounted-product-rating-value"
                      ></Typography>
                    </div>
                    <Typography variant="body1" className="discounted-price">
                      ₹ {product.priceAfterDiscount}
                      <span className="discount-box">
                        -
                        {calculateDiscountPercentage(
                          product.productPrice,
                          product.priceAfterDiscount
                        )}
                        %
                      </span>
                    </Typography>
                    <Typography variant="body1" className="product-price">
                      <s>₹ {product.productPrice}</s>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AllDiscountedProducts;