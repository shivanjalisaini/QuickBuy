import React from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box className="footer" py={5} px={2}>
      <Box
        textAlign="center"
        mb={2}
        className="back-to-top"
        onClick={handleScrollToTop}
        style={{ cursor: "pointer", fontFamily: "Arial", color: "#333" }}
      >
        <Typography
          variant="body1"
          component="div"
          style={{ cursor: "pointer" }}
        >
          Back to top
        </Typography>
      </Box>
      <hr className="footer-divider" />
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            marginLeft={"150px"}
          >
            Connect with Us
          </Typography>
          <Typography marginLeft={"150px"} variant="body1">
            Facebook
          </Typography>
          <Typography marginLeft={"150px"} variant="body1">
            Twitter
          </Typography>
          <Typography marginLeft={"150px"} variant="body1">
            Instagram
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" component="div" gutterBottom>
            Let Us Help You
          </Typography>
          <Typography variant="body1" component={Link} to="/viewProfile">
            Your Account
          </Typography>
          <Typography variant="body1">Returns Centre</Typography>
          <Typography variant="body1">100% Purchase Protection</Typography>
          <Typography variant="body1">EzyStore App Download</Typography>
          <Typography variant="body1">Help</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" component="div" gutterBottom>
            Get to Know Us
          </Typography>
          <Typography variant="body1">About Us</Typography>

          <Typography variant="body1">Press Releases</Typography>
        </Grid>
      </Grid>
      <Box mt={4} textAlign="center">
        <Typography variant="body2">© EzyStore.Com</Typography>
      </Box>
    </Box>
  );
};

export default Footer;