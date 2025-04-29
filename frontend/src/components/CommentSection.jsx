import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { FaUserCircle, FaPaperPlane, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CommentSection = ({ productId }) => {
  const { url, token, user, addComment, deleteComment } = useContext(ShopContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/product/comments/${productId}`);
      if (response.data.success) {
        // Sắp xếp comments theo thời gian mới nhất lên đầu
        const sortedComments = response.data.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComments(sortedComments);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.warning("Please log in to comment");
      return;
    }
    if (!newComment.trim()) {
      toast.warning("Comment cannot be empty");
      return;
    }

    try {
      const success = await addComment(productId, newComment);
      if (success) {
        setNewComment("");
        await fetchComments();
        toast.success("Comment added successfully");
      }
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const response = await axios.post(
          `${url}/api/product/comments/delete`,
          { commentId },
          { headers: { token: localStorage.getItem("adminToken") } }
        );
        
        if (response.data.success) {
          toast.success("Comment deleted successfully");
          setComments(prev => prev.filter(comment => comment._id !== commentId));
        } else {
          toast.error("Failed to delete comment");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Error deleting comment");
      }
    }
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  return (
    <div className="mt-8 w-full">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Customer Comments</h3>
      
      {/* Comment Form */}
      {token && (
        <form onSubmit={handleSubmitComment} className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <div className="text-2xl text-gray-400 mt-1">
              <FaUserCircle />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows="3"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  <FaPaperPlane size={14} />
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-left py-4 bg-white rounded-lg shadow-sm px-4">
            <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-base">
                    {comment.userId.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-base">{comment.userId.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                {user && (user._id === comment.userId._id || user.isAdmin) && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete comment"
                  >
                    <FaTrash size={16} />
                  </button>
                )}
              </div>
              <p className="text-gray-700 mt-2 pl-12 text-base leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;