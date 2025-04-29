import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { FaStar, FaRegStar, FaUserCircle, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReviewSection = ({ productId }) => {
  const { url, token, user, addReview } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [canReview, setCanReview] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/product/reviews/${productId}`);
      if (response.data.success) {
        const sortedReviews = response.data.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReviews(sortedReviews);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const checkCanReview = async () => {
    if (!token) {
      setCanReview(false);
      setErrorMessage("Please log in to review");
      return;
    }
    try {
      const response = await axios.post(
        `${url}/api/product/reviews/check`,
        { productId },
        { headers: { token } }
      );
      if (response.data.success) {
        setCanReview(true);
        setErrorMessage("");
      } else {
        setCanReview(false);
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setCanReview(false);
      setErrorMessage("Failed to check review permission");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.warning("Please log in to review");
      return;
    }
    if (!canReview) {
      toast.warning(errorMessage);
      return;
    }
    if (!newReview.trim()) {
      toast.warning("Review cannot be empty");
      return;
    }

    try {
      const success = await addReview(productId, rating, newReview);
      if (success) {
        setNewReview("");
        setRating(5);
        await fetchReviews();
        await checkCanReview();
        toast.success("Review submitted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add review");
    }
  };

  const renderRatingStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      i < rating ? 
        <FaStar key={i} className="text-yellow-400" /> : 
        <FaRegStar key={i} className="text-yellow-400" />
    ));
  };

  useEffect(() => {
    fetchReviews();
    checkCanReview();
  }, [productId, token]);

  return (
    <div className="mt-8 w-full">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Customer Ratings & Reviews</h3>
      
      {/* Review Form */}
      {token && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          {canReview ? (
            <form onSubmit={handleSubmitReview}>
              <div className="flex items-start gap-3">
                <div className="text-2xl text-gray-400 mt-1">
                  <FaUserCircle />
                </div>
                <div className="flex-1">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating:</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setRating(num)}
                          className="text-xl focus:outline-none"
                        >
                          {num <= rating ? 
                            <FaStar className="text-yellow-400" /> : 
                            <FaRegStar className="text-yellow-400" />}
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{rating}.0</span>
                    </div>
                  </div>
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Share your honest thoughts about this product..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows="4"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FaPaperPlane size={14} />
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 text-red-500 text-sm">
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-base">
                  {review.userId.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800 text-base">{review.userId.name}</p>
                      <div className="flex items-center gap-1">
                        {renderRatingStars(review.rating)}
                        <span className="ml-1 text-sm text-gray-600">{review.rating}.0</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mt-2 pl-12 text-base leading-relaxed">
                {review.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;