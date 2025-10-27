import mongoose from "mongoose";

const ReturnRequestSchema = new mongoose.Schema({
  orderId: { type: mongoose.Types.ObjectId, ref: "Order" },
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  items: [{ productId: mongoose.Types.ObjectId, qty: Number }],
  reason: String,
  status: { type: String, enum: ["requested","approved","rejected","refunded"], default: "requested" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ReturnRequest", ReturnRequestSchema);
