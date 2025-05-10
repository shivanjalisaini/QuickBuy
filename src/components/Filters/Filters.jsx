import React, { useState } from "react";
import { Slider, Typography } from "@mui/material";
import "./Filters.css";

const Filters = ({ onFilterChange, showDiscounts }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  // const [minPrice, setMinPrice] = useState("");
  // const [maxPrice, setMaxPrice] = useState("");

  const handleFilterChange = (type, value) => {
    onFilterChange(type, value);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    handleFilterChange("priceRange", newValue);
  };

  // const handleApplyPriceRange = () => {
  //   if (minPrice !== "" && maxPrice !== "") {
  //     handleFilterChange("priceRange", [minPrice, maxPrice]);
  //   }
  // };

  return (
    <div className="filters">
      <div className="filter-section">
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Typography gutterBottom>Avg. Customer Review</Typography>
        {[4, 3, 2, 1].map((rating) => (
          <div
            key={rating}
            className="filter-option"
            onClick={() => handleFilterChange("rating", rating)}
          >
            {rating} Stars & Up
          </div>
        ))}
      </div>

      <div className="filter-section">
        <Typography gutterBottom>Price Range</Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={500000}
          step={1000}
        />
        {/* <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <button onClick={handleApplyPriceRange}>Apply</button>
        </div> */}
      </div>

      {showDiscounts && (
        <div className="filter-section">
          <Typography gutterBottom>Discount</Typography>
          {[10, 25, 35, 50, 60, 70].map((discount) => (
            <div
              key={discount}
              className="filter-option"
              onClick={() => handleFilterChange("discount", discount)}
            >
              {discount}% Off or more
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filters;