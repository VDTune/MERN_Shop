import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OrderPopup } from "../components/OrderPopup";
import { sendEthViaContract } from "../utils/contract";

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderId, productId, userId, total } = state || {};
  const [errorMsg, setErrorMsg] = useState("");
  const [popupStatus, setPopupStatus] = useState("processing"); // 'processing', 'success', 'failed'
  const hasPaidRef = useRef(false);

  useEffect(() => {
    const pay = async () => {
      if (hasPaidRef.current) return;
      hasPaidRef.current = true;

      if (!orderId || !productId || !total || !userId) {
        console.log("❌ Dữ liệu thiếu: ", { orderId, productId, total, userId });
        setErrorMsg("Thiếu thông tin giao dịch");
        setPopupStatus("failed");
        return;
      }

      try {
        console.log("🔍 orderId:", orderId);
        console.log("🔍 productId:", productId);
        console.log("🔍 userId:", userId);
        console.log("🔍 total:", total);
        const txHash = await sendEthViaContract(orderId, productId, userId, total); // <-- chỉ gọi contract
        console.log("✅ Giao dịch thành công:", txHash);

        setPopupStatus("success");
        setTimeout(() => {
          setPopupStatus(false);
          // navigate("/"); // tuỳ ý chuyển trang
        }, 2000);
      } catch (err) {
        console.error("❌ Lỗi gửi qua contract:", err.message);
        setErrorMsg(err.message || "Lỗi không xác định");
        setPopupStatus("failed");

        setTimeout(() => {
          setPopupStatus(false);
        }, 2000);
      }
    };

    pay();
  }, [orderId, productId, userId, total]);

  return (
    <section className="max-padd-container py-28 xl:py-32">
      <OrderPopup status={popupStatus} message={popupStatus === "failed" ? errorMsg : undefined} />
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
