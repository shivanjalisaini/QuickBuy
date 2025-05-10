import React, { useState, useEffect } from "react";
import { getLandingPageCategories } from "../../../services/ApiService";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./LandingPageCategories.css";

const LandingPageCategory = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getLandingPageCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCardClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <Box className="landing-page-categories">
      <Typography variant="h4" component="div" align="center" gutterBottom>
        Categories
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category.categoryId}>
            <Card
              className="category-card"
              onClick={() => handleCardClick(category.categoryId)}
            >
              <div className="categories-image-container">
                <img
                  src={`data:image/jpeg;base64,${category.categoryImage}`}
                  alt={category.categoryName}
                  className="category-image"
                />
              </div>
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
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Button href="/allCategories" variant="text">
          Show More
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPageCategory;