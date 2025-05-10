import React, { useState } from 'react';
import './PaymentMode.css';
import CheckoutNavbar from '../../CheckoutNavbar/CheckoutNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faCreditCard, faMobileAlt, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const PaymentMode = () => {
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const navigate = useNavigate();

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  return (
    <div className="payment-page">
      <CheckoutNavbar/>
      <div className="payment-header">
        <h2>Select Payment Method</h2>
        <p className="payment-description">Choose your preferred payment method to complete the order.</p>
      </div>
      <div className="payment-options">
        <div className={`payment-option ${paymentMethod === 'COD' ? 'active' : ''}`} onClick={() => handlePaymentChange('COD')}>
          <FontAwesomeIcon icon={faMoneyBillWave} className="payment-icon" />
          <span className="payment-text">Cash on Delivery</span>
        </div>
        <div className="payment-option disabled">
          <FontAwesomeIcon icon={faCreditCard} className="payment-icon" />
          <span className="payment-text">Credit/Debit Card <br /><small>(Available Soon)</small></span>
        </div>
        <div className="payment-option disabled">
          <FontAwesomeIcon icon={faMobileAlt} className="payment-icon" />
          <span className="payment-text">UPI <br /><small>(Available Soon)</small></span>
        </div>
        <div className="payment-option disabled">
          <FontAwesomeIcon icon={faUniversity} className="payment-icon" />
          <span className="payment-text">Net Banking <br /><small>(Available Soon)</small></span>
        </div>
      </div>
      <button className="proceed-button" onClick={() => navigate("/confirmOrder")}>Proceed with {paymentMethod}</button>
    </div>
  );
};

export default PaymentMode;