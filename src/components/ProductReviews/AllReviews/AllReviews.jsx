import React, { useEffect, useState } from "react";
import {
  getProductReviews,
  deleteProductReview,
} from "../../../services/ApiService";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import "./AllReviews.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }

        const response = await getProductReviews(userId);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteProductReview(reviewId);
      toast.success("Review deleted successfully");
      setReviews(
        reviews.filter((review) => review.productReviewId !== reviewId)
      );
    } catch (error) {
      toast.error("Error deleting review");
      console.error("Error deleting review:", error);
    }
  };

  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  return (
    <div className="all-reviews-container">
      {reviews.length === 0 ? (
        <Typography variant="body1">There are No Reviews Yet</Typography>
      ) : (
        <Grid container spacing={2}>
          {reviews.map((review, index) => (
            <Grid item xs={12} key={index}>
              <Card className="review-card">
                <Grid container spacing={2} alignItems="center">
                  {review.imageUrl && (
                    <Grid item>
                      <CardMedia
                        className="review-image"
                        component="img"
                        image={`data:image/jpeg;base64,${review.imageUrl}`}
                        title={`Product`}
                      />
                    </Grid>
                  )}
                  <Grid item xs>
                    <CardContent>
                      <Typography variant="h6">Rating:</Typography>
                      <div className="star-rating">
                        {[...Array(review.ratingStar)].map((_, starIndex) => (
                          <StarIcon key={starIndex} />
                        ))}
                      </div>
                      <Typography variant="subtitle1">
                        Comment: {review.reviewComment}
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      className="delete-icon"
                      onClick={() => handleDeleteReview(review.productReviewId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <ToastContainer />
    </div>
  );
};

export default AllReviews;