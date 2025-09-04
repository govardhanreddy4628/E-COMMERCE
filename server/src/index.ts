import { app } from "./app";
import dotenv from "dotenv";
import "colors";
import connectDB from "./config/connectDB";

dotenv.config();

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  connectDB();
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









