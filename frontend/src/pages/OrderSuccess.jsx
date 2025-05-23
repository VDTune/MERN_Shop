import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderId } = state || {};

  return (
    <section className="max-padd-container py-28 xl:py-32">
      <h2 className="bold-28 mb-4">Order Placed Successfully!</h2>
      <p>Thank you for your order. Your order ID is: <strong>{orderId || "N/A"}</strong>.</p>
      <p>You will receive a confirmation soon.</p>
      <button
        onClick={() => navigate("/")}
        className="btn-secondary w-52 rounded mt-4"
      >
        Back to Home
      </button>
    </section>
  );
};

export default OrderSuccess;