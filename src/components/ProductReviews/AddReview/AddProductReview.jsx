import React, { useState } from "react";
import { Box, Button, Typography, TextField, Rating } from "@mui/material";
import { postProductReview } from "../../../services/ApiService";
import "./AddProductReview.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProductReview = () => {
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    if (selectedImage) {
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const reviewData = {
      productId: localStorage.getItem("selectedProductId"),
      userId: localStorage.getItem("userId"),
      ratingStar: rating,
      reviewComment: reviewComment,
      imageUrl: "",
    };

    if (image) {
      const base64Image = await toBase64(image);
      reviewData.imageUrl = base64Image;
    }

    setSubmitting(true);

    try {
      const response = await postProductReview(reviewData);
      console.log("Review submitted:", response.data);
      toast.success("Review submitted successfully!");
      setRating(0);
      setImage(null);
      setImageUrl(null);
      setReviewComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result
          .replace("data:image/jpeg;base64,", "")
          .replace("data:image/png;base64,", "");
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className="container">
      <Box component="form" onSubmit={handleSubmit} className="form-container">
        <Typography variant="h4" className="title">
          Write a Product Review
        </Typography>
        <Rating
          name="rating"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
          className="rating-stars"
        />
        <Typography variant="h6" className="subtitle">
          Add a Photo (Optional)
        </Typography>
        <Button variant="outlined" component="label" className="upload-button">
          Choose File
          <input type="file" hidden onChange={handleImageChange} />
        </Button>
        {imageUrl && (
          <div className="image-preview">
            <img src={imageUrl} alt="Uploaded" className="preview-image" />
          </div>
        )}
        <TextField
          label="Your Review"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={reviewComment}
          onChange={(event) => setReviewComment(event.target.value)}
          className="text-area"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="submit-button"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </Box>
      <ToastContainer />
    </div>
  );
};

export default AddProductReview;