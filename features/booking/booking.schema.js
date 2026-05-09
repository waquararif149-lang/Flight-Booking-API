import mongoose from "mongoose";

const bookingSchema=new mongoose.Schema({
    userId:{
       type:mongoose.Types.ObjectId,ref:"users"
    },
    flightId:{
        type:mongoose.Types.ObjectId,ref:"flights"
    },
    passengers:[
        {
          name:{
            type:String,
            required:true
          },
          age:{
            type:Number,
            required:true
          },
          passportNumber:{
            type:String,
            required:true
          }
        }
    ],
    seatNumbers:{
        type:[String],
        required:true
    },
    status:{
      type:String
    }
},{strict:true})

export const bookingModel=mongoose.model("booking",bookingSchema);