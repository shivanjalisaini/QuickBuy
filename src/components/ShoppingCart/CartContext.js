import React, { createContext, useState, useEffect } from "react";
import { getCartByUserId } from "../../services/ApiService";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartData = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await getCartByUserId(userId);
          const totalItems = response.items.reduce(
            (acc, item) => acc + item.quantity,
            0
          );
          setCartCount(totalItems);
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      }
    };

    fetchCartData();
    const cartIntervalId = setInterval(fetchCartData, 2000);

    return () => clearInterval(cartIntervalId);
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
};