import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

if(!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables");
}

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("database connected successfully".bgMagenta.white);
    } catch (error) {
        console.log("Mongodb connection error",error)
        process.exit(-1)       //1 is failure and 0 is success code
    }
}

export default connectDB;