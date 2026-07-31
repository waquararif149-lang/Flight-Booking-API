import mongoose from "mongoose";

const reservationSchema=new mongoose.Schema({
   userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"users",
      required:true
   },
   flightId:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"flights",
     required:true
   },
   seatNumbers:{
     type:[String],
     required:true
   },
   totalAmount:{
    type:Number,
    required:true
   },
   expiresAt:{type:Date}  
},{timestamps:true})

export const reservationModel=mongoose.model("reservation",reservationSchema);