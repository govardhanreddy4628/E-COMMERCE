import { app } from "./app.js";
import dotenv from "dotenv";
import "colors";
import connectDB from "./config/connectDB.js";
import redisClient from "./config/connectRedis.js";
import Razorpay from "razorpay";
import "./jobs/cleanupJob.js";
import "./agent/agent.js";



dotenv.config();

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();           // MongoDB connection
    await redisClient.connect(); // Redis connection

    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on ${process.env.NODE_ENV} mode on port ${PORT}`.bgCyan
          .white
      );
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

startServer();





// // --- src/server.ts ---
// // mongoose.connect(process.env.MONGO_URI!)
// //   .then(() => {
// //     console.log('Connected to MongoDB');
// //     app.listen(5000, () => console.log('Server running on port 5000'));
// //   })
// //   .catch(err => console.error(err));

// //*servers are not computers servers is a software.
// //*app.use() is used for middleware functions and works for all HTTP methods, while app.get() is used specifically for handling GET requests.









