import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB Atlas Connected");
    }catch(err){
       console.error(err);
       throw err;
    }
}

export default connectDB;