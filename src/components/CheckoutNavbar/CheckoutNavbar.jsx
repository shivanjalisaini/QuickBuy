import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./CheckoutNavbar.css";

const CheckoutNavbar = () => {
  const location = useLocation();

  const routes = [
    { path: "/shippingAddress", label: "Address", icon: "📍" },
    { path: "/paymentMode", label: "Payment", icon: "💳" },
    { path: "/confirmOrder", label: "Confirm Order", icon: "✔️" },
  ];

  return (
    <div className="checkout-navbar">
      {routes.map((route) => (
        <Link
          to={route.path}
          key={route.path}
          className={`nav-item ${
            location.pathname === route.path ? "active" : ""
          }`}
        >
          <div className="nav-icon">{route.icon}</div>
          <div className="nav-text">{route.label}</div>
        </Link>
      ))}
    </div>
  );
};

export default CheckoutNavbar;