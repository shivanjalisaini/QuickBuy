import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignupPage from "./components/Account/SignUp/Signup";
import LoginPage from "./components/Account/Login/Login";
import ForgetPassword from "./components/Account/ForgetPassword/ForgetPassword";
import VerifyOTP from "./components/Account/ForgetPassword/VerifyOtp";
import ResetPassword from "./components/Account/ResetPassword/ResetPassword";
import AllCategories from "./components/Categories/AllCategories";
import LandingPage from "./components/LandingPage/LandingPage";
import CustomNavbar from "./components/Navbar/Navbar";
import ShoppingCart from "./components/ShoppingCart/ShoppingCart";
import AllDiscountedProducts from "./components/AllDiscountedProducts/AllDiscountedProducts";
import AllBestSelling from "./components/AllBestSelling/AllBestSelling";
import ViewProfile from "./components/UserProfile/ViewProfile/ViewProfile";
import UpdateProfile from "./components/UserProfile/UpdateProfile/UpdateProfile";
import AddAddress from "./components/Addresses/AddAddress/AddAddress";
import AllAddresses from "./components/Addresses/AllAddresses/AllAddresses";
import UpdateAddress from "./components/Addresses/UpdateAddress/UpdateAddress";
import ShippingAddress from "./components/Addresses/ShippingAddress/ShippingAddress";
import AddProductReview from "./components/ProductReviews/AddReview/AddProductReview";
import AllReviews from "./components/ProductReviews/AllReviews/AllReviews";
import ChangePassword from "./components/Account/ChangePassword/ChangePassword";
import CategoryProducts from "./components/Products/CategoryProducts/CategoryProducts";
import SingleProduct from "./components/Products/SingleProduct/SingleProduct";
import { CartProvider } from "./components/ShoppingCart/CartContext";
import PaymentMode from "./components/Order/Payment/PaymentMode";
import ConfirmOrder from "./components/Order/ConfirmOrder/ConfirmOrder";
import OrderConfirmation from "./components/Order/OrderConfirmation/OrderConfirmation";
import TrackOrder from "./components/Order/TrackOrder/TrackOrder";
import OrderDetails from "./components/Order/OrderDetails/OrderDetails";
import PreviousOrders from "./components/Order/PreviousOrders/PreviousOrders";
import PreviousOrderDetails from "./components/Order/PreviousOrderDetails/PreviousOrderDetails";
import SelectLocation from "./components/Addresses/SelectLocation/SelectLocation";

function Home() {
  return (
    <>
      <LandingPage />
    </>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <WithNavbar>
                  <Home />
                </WithNavbar>
              }
            />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/forgetPassword" element={<ForgetPassword />} />
            <Route path="/verifyOtp" element={<VerifyOTP />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route
              path="/landingPage"
              element={
                <WithNavbar>
                  <LandingPage />
                </WithNavbar>
              }
            />
            <Route
              path="/allCategories"
              element={
                <WithNavbar>
                  <AllCategories />
                </WithNavbar>
              }
            />
            <Route
              path="/allDiscountedProducts"
              element={
                <WithNavbar>
                  <AllDiscountedProducts />
                </WithNavbar>
              }
            />
            <Route
              path="/allBestSelling"
              element={
                <WithNavbar>
                  <AllBestSelling />
                </WithNavbar>
              }
            />
            <Route
              path="/viewProfile"
              element={
                <WithNavbar>
                  <ViewProfile />
                </WithNavbar>
              }
            />
            <Route
              path="/updateProfile"
              element={
                <WithNavbar>
                  <UpdateProfile />
                </WithNavbar>
              }
            />
            <Route
              path="/addAddress"
              element={
                <WithNavbar>
                  <AddAddress />
                </WithNavbar>
              }
            />
            <Route
              path="/updateAddress"
              element={
                <WithNavbar>
                  <UpdateAddress />
                </WithNavbar>
              }
            />
            <Route
              path="/allAddresses"
              element={
                <WithNavbar>
                  <AllAddresses />
                </WithNavbar>
              }
            />
            <Route
              path="/shippingAddress"
              element={
                <WithNavbar>
                  <ShippingAddress />
                </WithNavbar>
              }
            />
            <Route
              path="/category/:categoryId"
              element={
                <WithNavbar>
                  <CategoryProducts />
                </WithNavbar>
              }
            />
            <Route
              path="/product/:productId"
              element={
                <WithNavbar>
                  <SingleProduct />
                </WithNavbar>
              }
            />
            <Route
              path="/paymentMode"
              element={
                <WithNavbar>
                  <PaymentMode />
                </WithNavbar>
              }
            />
            <Route
              path="/confirmOrder"
              element={
                <WithNavbar>
                  <ConfirmOrder />
                </WithNavbar>
              }
            />
            <Route
              path="/addProductReview"
              element={
                <WithNavbar>
                  <AddProductReview />
                </WithNavbar>
              }
            />
            <Route
              path="/shoppingCart"
              element={
                <WithNavbar>
                  <ShoppingCart />
                </WithNavbar>
              }
            />
            <Route
              path="/getAllReview"
              element={
                <WithNavbar>
                  <AllReviews />
                </WithNavbar>
              }
            />
            <Route
              path="/orderConfirmation"
              element={
                <WithNavbar>
                  <OrderConfirmation />
                </WithNavbar>
              }
            />
            <Route
              path="/trackOrder"
              element={
                <WithNavbar>
                  <TrackOrder />
                </WithNavbar>
              }
            />
            <Route
              path="/orderDetails"
              element={
                <WithNavbar>
                  <OrderDetails />
                </WithNavbar>
              }
            />
            <Route
              path="/previousOrders"
              element={
                <WithNavbar>
                  <PreviousOrders />
                </WithNavbar>
              }
            />
            <Route
              path="/previousOrderDetails/:orderId/product/:productId"
              element={
                <WithNavbar>
                  <PreviousOrderDetails />
                </WithNavbar>
              }
            />
            <Route
              path="/SelectLocation"
              element={
                <WithNavbar>
                  <SelectLocation />
                </WithNavbar>
              }
            />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

function WithNavbar({ children }) {
  return (
    <>
      <CustomNavbar />
      {children}
    </>
  );
}

export default App;