import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const url=process.env.DB_URL;

export const connectTomongoose=async()=>{
   await mongoose.connect(url);
   console.log("mongodb is conected using mongoose")
}