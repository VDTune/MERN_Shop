import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const { url, token } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Checkout page - orderData:", orderData); // Debug log
    if (!orderData) {
      console.warn("No orderData received. Redirecting to /cart.");
      navigate("/cart");
    }
  }, [orderData, navigate]);

  const confirmOrder = async () => {
    if (!orderData) {
      alert("No order data available. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/order/placeorder`,
        orderData,
        { headers: { token } }
      );
      if (response.data.success) {
        navigate("/order-success", { state: { orderId: response.data.orderId } });
      } else {
        alert(response.data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!orderData) {
    return <div className="max-padd-container py-28">No order data available. Redirecting...</div>;
  }

  const { address, items, amount } = orderData;

  return (
    <section className="max-padd-container py-28 xl:py-32">
      <h2 className="bold-28 mb-8">Checkout</h2>
      <div className="flex flex-col xl:flex-row gap-10 xl:gap-20">
        <div className="flex flex-1 flex-col gap-4">
          <h3 className="bold-22">Delivery Information</h3>
          <div className="bg-gray-100 p-4 rounded-sm">
            <p>
              <strong>Name:</strong> {address.firstName} {address.lastName}
            </p>
            <p>
              <strong>Email:</strong> {address.email}
            </p>
            <p>
              <strong>Phone:</strong> {address.phone}
            </p>
            <p>
              <strong>Address:</strong> {address.street}, {address.city}, {address.state}, {address.zipcode}, {address.country}
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <h3 className="bold-22">Order Details</h3>
          <div className="bg-gray-100 p-4 rounded-sm">
            {items.map((item, index) => (
              <div key={index} className="flexBetween py-2">
                <div>
                  <p className="medium-16">{item.name}</p>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="medium-16 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flexBetween py-2">
              <p className="medium-16">Subtotal:</p>
              <p className="medium-16 font-semibold">
                ${(amount - 2).toFixed(2)}
              </p>
            </div>
            <div className="flexBetween py-2">
              <p className="medium-16">Shipping Fee:</p>
              <p className="medium-16 font-semibold">$2.00</p>
            </div>
            <hr className="my-2" />
            <div className="flexBetween py-2">
              <p className="bold-18">Total:</p>
              <p className="bold-18">${amount.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={confirmOrder}
            className="btn-secondary w-52 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Checkout;