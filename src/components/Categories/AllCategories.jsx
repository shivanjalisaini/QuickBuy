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
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../services/ApiService";
import "./AllCategories.css";
const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.data);
      } catch (error) {
        setError("Error fetching categories: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSortClose = () => {
    setAnchorEl(null);
  };
  const handleSortOrder = (order) => {
    setSortOrder(order);
    setCategories(
      [...categories].sort((a, b) => {
        if (order === "asc") {
          return a.categoryName.localeCompare(b.categoryName);
        } else {
          return b.categoryName.localeCompare(a.categoryName);
        }
      })
    );
    handleSortClose();
  };
  const handleCardClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };
  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  return (
    <Container className="categories-container">
      <Typography
        variant="h4"
        component="h2"
        className="category-title"
        align="center"
        gutterBottom
      >
        Categories
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
        <MenuItem onClick={() => handleSortOrder("asc")}>Ascending</MenuItem>
        <MenuItem onClick={() => handleSortOrder("desc")}>Descending</MenuItem>
      </Menu>
      <Grid container spacing={4}>
        {categories.map((category) => (
          <Grid item key={category.categoryId} xs={12} sm={6} md={4}>
            <Card
              className="all-category-card"
              onClick={() => handleCardClick(category.categoryId)}
            >
              <CardMedia
                component="img"
                height="150"
                image={`data:image/jpeg;base64,${category.categoryImage}`}
                alt={category.categoryName}
                className="category-image"
              />
              <CardContent>
                <Typography
                  variant="h6"
                  component="div"
                  className="category-name"
                >
                  {category.categoryName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
export default AllCategories;