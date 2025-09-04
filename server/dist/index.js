"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
require("colors");
const connectDB_1 = __importDefault(require("./config/connectDB"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8080;
app_1.app.listen(PORT, () => {
    (0, connectDB_1.default)();
    console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});
// // --- src/server.ts ---
// // mongoose.connect(process.env.MONGO_URI!)
// //   .then(() => {
// //     console.log('Connected to MongoDB');
// //     app.listen(5000, () => console.log('Server running on port 5000'));
// //   })
// //   .catch(err => console.error(err));
// //*servers are not computers servers is a software.
// //*app.use() is used for middleware functions and works for all HTTP methods, while app.get() is used specifically for handling GET requests.
