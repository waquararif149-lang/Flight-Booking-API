import express, { json } from "express";
import ApplicationError from "./errorhandler/application.error.js";
import userRouter from "./features/user/user.routs.js";
import authRouter from "./features/Auth/Auth.routs.js";
import bookingRouter from "./features/booking/booking.routs.js";
import flightRouter from "./features/flight/flight.routs.js";
import { jwtAuth } from "./middleware.js/jwt.auth.js";
import seatRouter from "./features/seat/seat.routes.js";

const app=express();

app.use(express.json());
app.use("/image",express.static("images"))

app.use("/api/auth/user",authRouter)
app.use("/api/user",jwtAuth,userRouter);
app.use("/api/flights",flightRouter);
app.use("/api/bookings",jwtAuth,bookingRouter);
app.use("/api/seats",seatRouter);

app.use((error,req,res,next)=>{
   if(error instanceof ApplicationError){
    return res.status(error.code).send(error.message);
   }else{
     return res.status(500).send(error.message);
   }
}
)

export default app;