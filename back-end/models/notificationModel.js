import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order", required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["success", "error", "info", "warning"],
    default: "info",
  },
  invoicePdf: { type: String, default: null },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
