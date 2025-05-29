import express from "express"   //refer API reference of express site for more info.
import cors from "cors"
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express()

const corsOptions = {
    origin: process.env.CORS_ORIGIN, // || "https://food-app-yt.onrender.com",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true
}

// default middleware for any mern project
app.use(cors(corsOptions))         // refer npm cors site for more info.
app.use(morgan("dev"))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit: "10mb"}))
app.use(express.static("public")) //public is a folder name where we can store images
app.use(cookieParser())

export {app}