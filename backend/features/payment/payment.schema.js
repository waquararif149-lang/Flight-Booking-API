import mongoose from "mongoose";

const paymentSchema=new mongoose.Schema({
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"bookings"
    },
    reservationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"reservations",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    razorpayOrderId: {
      type: String,
    },

    razorpayPaymentId: {
      type: String,
    },
    razorpayRefundId:{
        type:String
    },

    razorpaySignature: {
      type: String,
    },
    status:{
        type:String,
        enum:[
            "pending",
            "paid",
            "failed",
            "refund_initiated",
            "refunded"
        ],
        default:"pending"
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
},{timestamps:true})

paymentSchema.index({ userId: 1 });
paymentSchema.index({ reservationId: 1 });

export const paymentModel=mongoose.model("payment",paymentSchema);