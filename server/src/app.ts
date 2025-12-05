import express from "express"; //refer API reference of express site for more info.
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import http from "http";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import cartRouter from "./routes/cartRoute.js";
import { Message } from "./models/MessageModel.js";
import rateLimit from 'express-rate-limit';
import { customersData } from "./data/customers.js";
import * as ai from "./services/aiService.js";
import { Server } from "socket.io";
import { handleQuery } from "./controllers/assistantController.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import offersRoutes from "./routes/offersRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
// import couponRouter from "./routes/couponRoute.js";
// import orderRoutes from "./routes/orderRoute.js";

import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { functions } from "./inngest/functions.js";
import { initAdminChat } from "./sockets/initAdminChat.js";
import { initAssistantChat } from "./sockets/initAssistantChat.js";
import { socketAuthenticator } from "./middleware/socketAuthenticator.js";
import uploadRoutes from "./routes/uploadRoutes.js";  
//import authRoutes from "./routes/authRoutes.js"

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL_DEV,
  process.env.CLIENT_URL_PROD,
].filter(Boolean);

// ✅ Dynamic CORS configuration
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // important for cookies/auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use((req, res, next) => {
  console.log("HEADERS SENT:", res.getHeaders());
  next();
});



// default middleware for any mern project
app.use(cors(corsOptions)); // refer npm cors site for more info. and this middleware should be at top.

// ✅ Handle preflight requests globally
app.options("http://localhost:5173", cors(corsOptions));

app.use(cookieParser());

app.use((req, res, next) => {
  console.log("🌍 CORS origin received:", req.headers.origin);
  next();
});

app.use(express.static("public")); //public is a folder name where we can store images
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet({crossOriginResourcePolicy: false}))
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.static("public"));   // serve static assets

app.use("/api/inngest", serve({ client: inngest, functions }));




// ---------------------- API ROUTES ----------------------
app.use("/api/v1/user", userRoutes);
//app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/chat", chatRoutes)
app.use("/api/v1/offers", offersRoutes)
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/cart", cartRouter);
// app.use("/api/v1/coupons", couponRouter);
// app.use("/api/v1/payments", paymentRoutes);
// app.use("/api/v1/order", orderRoutes);
// app.use("/api/v1/address", addressRoutes);
// app.use("/api/v1/event", eventRoutes);

//app.post("/assistant/query", handleQuery);

app.use("/api/v1/customers",  (req, res) => {
  res.status(200).json(customersData)
})


app.get("/api/getkey", (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
});

// ---------------------- SOCKET.IO ----------------------
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL_PROD || "http://localhost:5173", methods: ["GET", "POST"], credentials:true },
});

app.set("io", io);

io.use((socket, next) => {socketAuthenticator(socket, next)});

// Use separate namespaces
const adminNamespace = io.of("/admin");
adminNamespace.use((socket, next) => socketAuthenticator(socket, next)); 

const assistantNamespace = io.of("/assistant");
assistantNamespace.use((socket, next) => socketAuthenticator(socket, next)); 

// Initialize chat modules
initAdminChat(adminNamespace);
initAssistantChat(assistantNamespace);



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


// ---------------------- Middleware to log cookies ----------------------
// res.send is the Express method used to send a response back to the client. This middleware overwrites res.send temporarily to log the Set-Cookie headers every time the server sends a response.so below code logs cookies in dev. remove it in production.
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (...args) {
      console.log('Set-Cookie headers:', res.getHeader('Set-Cookie'));
      return originalSend.apply(this, args);
    };
    next();
  });
}




// // Error handler (must be at last in code)
app.use(errorHandler);

const DIRNAME = path.resolve();
app.use(express.static(path.join(DIRNAME, "/client/dist")));  // React build files
app.use("*", (_, res) => {
  res.sendFile(path.resolve(DIRNAME, "client", "dist", "index.html"));
});
export { server as app }; // export the server
