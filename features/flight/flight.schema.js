import mongoose, { model } from "mongoose"

const flightSchema=new mongoose.Schema({
    flightNumber:{
        type:String,
        required:true
    },
    airline:{
        type:String,
        required:true
    },
    departureCity:{
        type:String,
        required:true
    },
    arrivalCity:{
        type:String,
        required:true
    },
    departureDate:{
        type:Date,
        required:true
    },
    arrivalDate:{
        type:Date,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    availableSeats:{
        type:Number,
        required:true
    },
    flightClass:{
        type:String,
        required:true
    },
    logo:{
        type:String
    }
},{strict:true})

const flightModel=mongoose.model("flight",flightSchema);
export default flightModel;
