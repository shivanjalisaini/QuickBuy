import React from "react";
import Banner from "./Banner/Banner";
import BestSellerCategories from "./BestSelling/BestSelling";
import DiscountedProducts from "./DiscountedProducts/DiscountedProducts";
import LandingPageCategory from "./LandingPageCategories/LandingPageCategories";
import Footer from "./Footer/Footer";
import CategoryWithImage from "./CategoryWithImage/CategoryWithImage";
import HotDeals from "./HotDeals/HotDeals";

function LandingPage() {
  return (
    <>
      <Banner />
      <CategoryWithImage />
      <BestSellerCategories />
      <DiscountedProducts />
      <HotDeals />
      <LandingPageCategory />
      <Footer />
    </>
  );
}

export default LandingPage;