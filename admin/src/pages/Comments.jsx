import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Comments = ({ url }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/product/comments/all`, {
        headers: { token: localStorage.getItem("adminToken") },
      });
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await axios.post(
        `${url}/api/product/comments/delete`,
        { commentId },
        { headers: { token: localStorage.getItem("adminToken") } }
      );
      if (response.data.success) {
        toast.success("Comment deleted successfully");
        fetchComments();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete comment");
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Manage Comments</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No comments found
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div 
                key={comment._id} 
                className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                      {comment.userId.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{comment.userId.name}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <div className="text-sm text-gray-500">
                    <span>Product ID: {comment.productId}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteComment(comment._id)}
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

export default Comments;