import React, { useState, useEffect } from "react";
import { getBanners } from "../../../services/ApiService";
import "./Banner.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rightImages, setRightImages] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getBanners();
        setBanners(response.data);
        setRightImages(response.data.slice(-2));
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [banners]);

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  return (
    <div className="banner-container">
      <div className="banner-left">
        <div
          className="banner-slider"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={index} className="banner-item">
              <img
                src={`data:image/jpeg;base64,${banner.bannerImageUrl}`}
                alt={banner.bannerTitle}
                className="banner-image"
              />
            </div>
          ))}
        </div>
        <button
          className="banner-arrow banner-arrow-left"
          onClick={handlePrevClick}
        >
          &lt;
        </button>
        <button
          className="banner-arrow banner-arrow-right"
          onClick={handleNextClick}
        >
          &gt;
        </button>
        <div className="banner-dots">
          {banners.map((_, index) => (
            <span
              key={index}
              className={`banner-dot ${
                index === currentImageIndex ? "active" : ""
              }`}
              onClick={() => setCurrentImageIndex(index)}
            ></span>
          ))}
        </div>
      </div>
      <div className="banner-right">
        {rightImages.map((image, index) => (
          <div key={index} className="banner-right-item">
            <img
              src={`data:image/jpeg;base64,${image.bannerImageUrl}`}
              alt={`Static Image ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;