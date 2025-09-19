import express from "express"; //refer API reference of express site for more info.
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import categoryRoutes from "./routes/categoryRoutes";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import uploadRouter from "./routes/upLoad";
import http from "http";
import helmet from "helmet";
import { Server } from "socket.io";
import { errorHandler } from "./middleware/errorHandler";
import cartRouter from "./routes/cartRoute";
import { Message } from "./models/MessageModel";
import rateLimit from 'express-rate-limit';
import { customersData } from "./data/customers";
import chatRoutes from "./routes/chatRoutes";
import offersRoutes from "./routes/offersRoutes";

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL, // || "https://food-app-yt.onrender.com" for production,
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,          // ✅ Allow cookies/auth headers
};

const DIRNAME = path.resolve();

// default middleware for any mern project
app.use(cors(corsOptions)); // refer npm cors site for more info.
app.use(morgan("dev"));
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public")); //public is a folder name where we can store images
app.use(cookieParser());
app.use(helmet({crossOriginResourcePolicy: false}))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("message", (msg) => {
    console.log("📨 Message received:", msg);
    io.emit("message", msg); // broadcast to all clients
  });

  socket.on("sendMessage", async (msg) => {
    const saved = await new Message(msg).save();
    io.to(msg.receiverId).emit("receiveMessage", saved);
  });

  socket.on("join", (userId) => {
    socket.join(userId); // Use user ID as room
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

// Optional: Get chat history
app.get("/api/messages/:userId", async (req, res) => {
  const messages = await Message.find({
    $or: [
      { senderId: req.params.userId },
      { receiverId: req.params.userId },
    ],
  }).sort({ createdAt: 1 });
  res.json(messages);
});

app.get("/", (req, res) => {
  res.send("Socket.IO server is running...");
});

//api
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/chat", chatRoutes)
app.use("/api/v1/offers", offersRoutes)
// app.use("/api/v1/upload", uploadRouter);
// app.use("/api/v1/cart", cartRouter);
// app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/customers",  (req, res) => {
  res.status(200).json(customersData)
})

app.use(express.static(path.join(DIRNAME, "/client/dist")));
app.use("*", (_, res) => {
  res.sendFile(path.resolve(DIRNAME, "client", "dist", "index.html"));
});

app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (...args) {
    console.log('Set-Cookie headers:', res.getHeader('Set-Cookie'));
    return originalSend.apply(this, args);
  };
  next();
});


// // Error handler (must be last)
//app.use(errorHandler);

export { server as app }; // export the server
