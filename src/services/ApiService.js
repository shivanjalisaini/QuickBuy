import { get, post, put, del } from "./AxiosApiService";
import { endpoints } from "../constants/endpoints";

export const getAllCategories = async () => {
  return await get(endpoints.categoryList);
};

export const getAllProducts = async () => {
  return await get(endpoints.productList);
};

export const getBanners = async () => {
  return await get(endpoints.bannerList);
};

export const getLandingPageCategories = async () => {
  return await get(endpoints.landingPageCategories);
};

export const getBestSelling = async () => {
  return await get(endpoints.bestSellingList);
};

export const getDiscountedProducts = async () => {
  return await get(endpoints.discountedProductsList);
};

export const getAllDiscountedProducts = async () => {
  return await get(endpoints.allDiscountedProducts);
};

export const getAllBestSelling = async () => {
  return await get(endpoints.allBestSellingProducts);
};

export const getViewProfile = async (userId) => {
  return await get(`${endpoints.viewProfile}/${userId}`);
};

export const getAddressByUserId = async (userId) => {
  return await get(`${endpoints.getAddressByUserId}/${userId}`);
};

export const getAddressById = async (addressId) => {
  return await get(`${endpoints.getAddressById}/${addressId}`);
};

export const getProductsByCategory = async (categoryId) => {
  return await get(`${endpoints.getProductByCategory}/${categoryId}`);
};

export const getSingleProduct = async (productId) => {
  return await get(`${endpoints.getSingleProduct}/${productId}`);
};

export const getProductReviews = async (userId) => {
  return await get(`${endpoints.getProductReview}/${userId}`);
};

export const getCartByUserId = async (userId) => {
  return await get(`${endpoints.getCartByUserId}/${userId}`);
};

export const getRecentOrders = async (userId) => {
  return await get(`${endpoints.currentOrder}/${userId}`);
};

export const getPreviousOrders = async (userId) => {
  return await get(`${endpoints.previousOrder}/${userId}`);
};

export const getTrackOrder = async (orderId) => {
  return await get(`${endpoints.trackOrder}/${orderId}`);
};

export const getOrderDetails = async (orderId) => {
  return await get(`${endpoints.orderDetails}/${orderId}`);
};

export const updateProfile = async (userId, data) => {
  return await put(`${endpoints.updateProfile}/${userId}`, data);
};

export const createCart = async (userId, productId, quantity) => {
  return await post(endpoints.addCart, { userId, productId, quantity });
};

export const updateCartItem = async (cartId, productId, quantity) => {
  return await put(
    `${endpoints.updateCartItem}/${cartId}/${productId}/${quantity}`,
    { quantity }
  );
};

export const updateAddress = async (addressId, data) => {
  return await put(`${endpoints.updateAddress}/${addressId}`, data);
};

export const registerUser = async (data) => {
  return await post(endpoints.register, data);
};

export const postProductReview = async (data) => {
  return await post(endpoints.createProductReview, data);
};

export const sendOtp = async (data) => {
  return await post(endpoints.sendOtp, data);
};

export const loginUser = async (data) => {
  try {
    return await post(endpoints.login, data);
  } catch (error) {
    if (error.response) {
      return {
        succeeded: false,
        message: error.response.data.message,
      };
    } else {
      return {
        succeeded: false,
        message: "An unexpected error occurred",
      };
    }
  }
};

export const forgetPassword = async (data) => {
  return await post(endpoints.forgetPassword, data);
};

export const postResetPassword = async (data) => {
  return await post(endpoints.resetPassword, data);
};

export const postChangePassowrd = async (data) => {
  return await post(endpoints.changePassword, data);
};

export const createAddress = async (data) => {
  return await post(endpoints.createAddress, data);
};

export const placeOrder = async (orderDetails) => {
  return await post(endpoints.placeOrder, orderDetails);
};

export const deleteAddress = async (addressId) => {
  return await del(`${endpoints.deleteAddress}/${addressId}`);
};

export const deleteProductReview = async (reviewId) => {
  return await del(`${endpoints.deleteProductReview}/${reviewId}`);
};

export const deleteProductFromCart = async (cartId, productId) => {
  return await del(`${endpoints.deleteProductFromCart}/${cartId}/${productId}`);
};

export const cancelOrder = async (orderId, data) => {
  return await put(`${endpoints.cancelOrder}/${orderId}`, data);
};

export const deleteCart = async (userId) => {
  return await del(`${endpoints.emptyCart}/${userId}`);
};