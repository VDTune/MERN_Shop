import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const commentModel = mongoose.models.comment || mongoose.model("comment", commentSchema);
export default commentModel;