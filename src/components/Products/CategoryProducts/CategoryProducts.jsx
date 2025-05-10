import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
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
import { useParams, useNavigate } from "react-router-dom";
import { getProductsByCategory } from "../../../services/ApiService";
import Filters from "../../Filters/Filters";
import "./CategoryProducts.css";

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

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({
    rating: null,
    priceRange: null,
    discount: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductsByCategory(categoryId);
        setProducts(response);
      } catch (error) {
        setError("Error fetching products: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

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
    setProducts(
      [...products].sort((a, b) => {
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
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const applyFilters = (products) => {
    return products.filter((product) => {
      if (filters.rating && product.averageRatingStar < filters.rating) {
        return false;
      }
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (product.productPrice < min || product.productPrice > max) {
          return false;
        }
      }
      if (filters.discount && product.discount < filters.discount) {
        return false;
      }
      return true;
    });
  };

  const filteredProducts = applyFilters(products);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container className="category-products-container">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={3} className="filter-container">
          <Filters onFilterChange={handleFilterChange} showDiscounts={false} />
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <Typography
            variant="h4"
            component="h2"
            className="category-products-title"
            align="center"
            gutterBottom
          >
            {products[0]?.categoryName}
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
                  className="category-product-card"
                  onClick={() => handleCardClick(product.productId)}
                >
                  <div className="category-product-image-container">
                    <img
                      src={`data:image/jpeg;base64,${product.productImages[0]}`}
                      alt={product.productName}
                      className="category-product-image"
                    />
                  </div>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      className="category-product-name"
                    >
                      {product.productName}
                    </Typography>
                    <div className="category-product-rating">
                      {renderStars(product.averageRatingStar)}
                      <Typography
                        variant="body1"
                        className="category-product-rating-value"
                      ></Typography>
                    </div>
                    <Typography
                      variant="body1"
                      className="category-product-price"
                    >
                      ₹ {product.priceAfterDiscount}
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

export default CategoryProducts;