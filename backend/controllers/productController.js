import productModel from "../models/productModel.js";
import commentModel from "../models/commentModel.js";
import reviewModel from "../models/reviewModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";

// Thêm sản phẩm
const addProduct = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const product = new productModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await product.save();
    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to add product" });
  }
};

// Lấy danh sách sản phẩm
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, data: products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to fetch products" });
  }
};

// Xóa sản phẩm
const removeProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.id);
    fs.unlink(`uploads/${product.image}`, () => {});
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to remove product" });
  }
};

// Thêm bình luận
const createComment = async (req, res) => {
  try {
    const { productId, content } = req.body;
    const userId = req.user.userId; // Lấy từ authMiddleware

    const comment = new commentModel({
      userId,
      productId,
      content,
    });

    await comment.save();
    res.json({ success: true, message: "Comment added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to add comment" });
  }
};

// Lấy danh sách bình luận theo productId
const getComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const comments = await commentModel
      .find({ productId })
      .populate("userId", "name");
    res.json({ success: true, data: comments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to fetch comments" });
  }
};

// Lấy tất cả bình luận (cho admin)
const getAllComments = async (req, res) => {
  try {
    const comments = await commentModel.find({}).populate("userId", "name");
    res.json({ success: true, data: comments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to fetch all comments" });
  }
};

// Xóa bình luận
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    await commentModel.findByIdAndDelete(commentId);
    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to delete comment" });
  }
};

// Thêm đánh giá
const createReview = async (req, res) => {
  try {
    const { productId, rating, content } = req.body;
    const userId = req.user.userId; // Lấy từ authMiddleware
    console.log("User ID:", userId); // Log userId
    console.log("Product ID:", productId); // Log productId

    // Kiểm tra xem user có đơn hàng đã thanh toán chứa sản phẩm này hay không
    const orders = await orderModel.find({ userId, payment: true });
    console.log("Orders found:", orders); // Log đơn hàng

    let hasPurchased = false;
    for (const order of orders) {
      const purchasedProduct = order.items.find(
        (item) => item._id.toString() === productId
      );
      console.log("Purchased Product:", purchasedProduct); // Log sản phẩm
      if (purchasedProduct) {
        hasPurchased = true;
        break;
      }
    }

    if (!hasPurchased) {
      console.log("User has not purchased this product");
      return res.json({
        success: false,
        message: "You must have paid for this product to review it",
      });
    }

    // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
    const existingReview = await reviewModel.findOne({ userId, productId });
    console.log("Existing Review:", existingReview); // Log đánh giá hiện có
    if (existingReview) {
      console.log("User has already reviewed this product");
      return res.json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = new reviewModel({
      userId,
      productId,
      rating,
      content,
    });

    await review.save();
    console.log("Review saved successfully");
    res.json({ success: true, message: "Review added successfully" });
  } catch (error) {
    console.log("Error in createReview:", error); // Log lỗi chi tiết
    res.json({ success: false, message: "Failed to add review", error: error.message });
  }
};

// Thêm hàm kiểm tra quyền đánh giá
const checkReviewPermission = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId; // Lấy từ authMiddleware

    // Kiểm tra xem user có đơn hàng đã thanh toán chứa sản phẩm này hay không
    const orders = await orderModel.find({ userId, payment: true });
    let hasPurchased = false;

    for (const order of orders) {
      const purchasedProduct = order.items.find(
        (item) => item._id.toString() === productId
      );
      if (purchasedProduct) {
        hasPurchased = true;
        break;
      }
    }

    if (!hasPurchased) {
      return res.json({
        success: false,
        message: "You must have paid for this product to review it",
      });
    }

    // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
    const existingReview = await reviewModel.findOne({ userId, productId });
    if (existingReview) {
      return res.json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    res.json({ success: true, message: "You can review this product" });
  } catch (error) {
    console.log("Error in checkReviewPermission:", error);
    res.json({ success: false, message: "Failed to check review permission" });
  }
};

// Lấy danh sách đánh giá theo productId
const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewModel
      .find({ productId })
      .populate("userId", "name");
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to fetch reviews" });
  }
};

// Lấy tất cả đánh giá (cho admin)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({}).populate("userId", "name");
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to fetch all reviews" });
  }
};

// Xóa đánh giá
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.body;
    await reviewModel.findByIdAndDelete(reviewId);
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to delete review" });
  }
};

export {
  addProduct,
  listProduct,
  removeProduct,
  createComment,
  getComments,
  getAllComments,
  deleteComment,
  createReview,
  getReviews,
  getAllReviews,
  deleteReview,
  checkReviewPermission,
};