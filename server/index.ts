const express = require("express");
const dotenv = require("dotenv");
import { app } from "./app";
import categoryRoutes from "./src/routes/categoryRoutes";
import authRoutes from "./src/routes/authRoutes";
import productRoutes from "./src/routes/productRoutes";
import path from "path";
import colors from "colors";    
import { errorHandler } from "./src/middlewares/errorHandler";


dotenv.config()

const PORT = process.env.PORT || 5000

const DIRNAME = path.resolve();

// api
app.get("/",(req, res)=>{res.send("server running on" + PORT)})
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/category", categoryRoutes)

app.use(express.static(path.join(DIRNAME,"/client/dist")));
app.use("*",(_,res) => {
    res.sendFile(path.resolve(DIRNAME, "client","dist","index.html"));
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, ()=>console.log(`surver running successfully on ${PORT}`.bgCyan))




// --- src/server.ts ---
// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import authRoutes from './routes/auth.routes';
// import { errorHandler } from './middleware/errorHandler';

// dotenv.config();
// const app = express();

// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// app.use(express.json());
// app.use(cookieParser());

// app.use('/api/auth', authRoutes);
// app.use(errorHandler);

// mongoose.connect(process.env.MONGO_URI!)
//   .then(() => {
//     console.log('Connected to MongoDB');
//     app.listen(5000, () => console.log('Server running on port 5000'));
//   })
//   .catch(err => console.error(err));











//*servers are not computers serers is a software. 
//*app.use() is used for middleware functions and works for all HTTP methods, while app.get() is used specifically for handling GET requests.