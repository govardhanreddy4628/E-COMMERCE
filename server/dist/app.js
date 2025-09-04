"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express")); //refer API reference of express site for more info.
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.CLIENT_URL, // || "https://food-app-yt.onrender.com" for production,
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};
const DIRNAME = path_1.default.resolve();
// default middleware for any mern project
app.use((0, cors_1.default)(corsOptions)); // refer npm cors site for more info.
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use(express_1.default.static("public")); //public is a folder name where we can store images
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
const server = http_1.default.createServer(app);
exports.app = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log("🔌 A user connected:", socket.id);
    socket.on("message", (msg) => {
        console.log("📨 Message received:", msg);
        io.emit("message", msg); // broadcast to all clients
    });
    socket.on("disconnect", () => {
        console.log("❌ A user disconnected:", socket.id);
    });
});
app.get("/", (req, res) => {
    res.send("Socket.IO server is running");
});
//api
app.use("/api/v1/auth", userRoutes_1.default);
// app.use("/api/v1/product", productRoutes);
// app.use("/api/v1/category", categoryRoutes);
// app.use("/api/v1/upload", uploadRouter);
// app.use("/api/v1/cart", cartRouter);
app.use(express_1.default.static(path_1.default.join(DIRNAME, "/client/dist")));
app.use("*", (_, res) => {
    res.sendFile(path_1.default.resolve(DIRNAME, "client", "dist", "index.html"));
});
