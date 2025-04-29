import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reviews = ({ url }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/product/reviews/all`, {
        headers: { token: localStorage.getItem("adminToken") },
      });
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const response = await axios.post(
        `${url}/api/product/reviews/delete`,
        { reviewId },
        { headers: { token: localStorage.getItem("adminToken") } }
      );
      if (response.data.success) {
        toast.success("Review deleted successfully");
        fetchReviews();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete review");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col h-screen"> {/* Thêm flex-col và h-screen */}
      <div className="p-6"> {/* Di chuyển padding vào div con */}
        <h2 className="text-2xl font-bold mb-6">Manage Reviews</h2>
      </div>
      
      {/* Phần nội dung có thanh cuộn riêng */}
      <div className="flex-1 overflow-y-auto px-6 pb-6"> {/* Thêm overflow-y-auto */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No reviews found
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div 
                key={review._id} 
                className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                      {review.userId.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{review.userId.name}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{review.content}</p>
                  <div className="text-sm text-gray-500">
                    <span>Product ID: {review.productId}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteReview(review._id)}
                  className="px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;