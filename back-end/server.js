import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/user.Routes.js";
import productRouter from "./routes/product.Routes.js";
import cartRouter from "./routes/cart.Routes.js";
import orderRouter from "./routes/order.Routes.js";
import customerReviewRouter from "./routes/customerReview.Routes.js";
import notificationRouter from "./routes/notification.Routes.js";
import ChatSession from "./models/ChatSessionModel.js";
import ChatMessage from "./models/ChatMessage.js";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { instrument } = require("@socket.io/admin-ui");

// ------------------------
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
instrument(io, { auth: false });

const PORT = process.env.PORT || 4000;
const __dirname = path.resolve();

// ------------------------
connectCloudinary();
await connectDB();

app.set("trust proxy", true);
app.use(express.json());
app.use(cors({}));
app.use("/invoices", express.static(path.join(__dirname, "invoices")));

// ------------------------
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/customerReview", customerReviewRouter);
app.use("/api/notification", notificationRouter);
app.get("/api/chat/sessions", async (req, res) => {
  const sessions = await ChatSession.find().sort({ updatedAt: -1 });
  res.json(sessions);
});
app.get("/api/messages/:sessionId", async (req, res) => {
  try {
    const messages = await ChatMessage.find({ sessionId: req.params.sessionId });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});


app.get("/", (req, res) => res.send("API WORKING ✅"));

// =================================================================
// 💬 SOCKET.IO CHAT FUNCTIONALITY
// =================================================================
let adminSocket = null; // only one admin for simplicity

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // When a user starts chat
  socket.on('start_chat', async ({ userId }) => {
   let session = await ChatSession.findOne({ userId });
if (!session) session = await ChatSession.create({ userId });

    socket.join(`session_${session._id}`);
    console.log(`User ${userId} started chat: ${session._id}`);

const messages = await ChatMessage.find({ sessionId: session._id });
    socket.emit("chat_history", { sessionId: session._id, history: messages });

    io.emit('customer_waiting', session); // notify admin
  });

  // When admin joins
  socket.on('admin_joined', async ({ sessionId }) => {
    socket.join(`session_${sessionId}`);
    console.log(`Admin joined session: ${sessionId}`);

    const messages = await ChatMessage.find({ sessionId });
   socket.emit("chat_history", { sessionId, history: messages });

    io.to(`session_${sessionId}`).emit('admin_joined');
  });

  // When user or admin sends a message
socket.on('send_message', async ({ sessionId, sender, message }) => {
  if (!sessionId) return;
  const msg = await ChatMessage.create({ sessionId, sender, message });
  await ChatSession.findByIdAndUpdate(sessionId, { updatedAt: Date.now() });
  io.to(`session_${sessionId}`).emit('receive_message', msg);
});


  // When admin closes chat
  socket.on('close_chat', async ({ sessionId }) => {
  await ChatSession.findByIdAndUpdate(sessionId, { isClosed: true });
  io.to(`session_${sessionId}`).emit('chat_closed', { sessionId });
});


  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


// =================================================================
// 🚀 START SERVER
// =================================================================
server.listen(PORT, () => {
  console.log(`✅ Server running with WebSocket on port ${PORT}`);
});
