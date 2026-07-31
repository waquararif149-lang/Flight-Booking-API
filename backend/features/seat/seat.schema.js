import mongoose,{model} from "mongoose";
const seatSchema=new mongoose.Schema({
    flightId:{
        type:mongoose.Schema.Types.ObjectId,ref:"flights"
    },
    seatNumber: {
        type: String,
        required: true
    },

    seatType: {
        type: String,
        enum: ["Window", "Middle", "Aisle"],
        required: true
    },

    status: {
        type: String,
        enum: ["Available", "Booked","Reserved"],
        default: "Available"
    }
})

seatSchema.index({
    flightId: 1,
    seatNumber: 1
}, {
    unique: true
});

export const seatModel=mongoose.model("seat",seatSchema);