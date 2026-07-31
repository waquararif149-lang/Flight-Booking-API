import express, { json } from "express";
import ApplicationError from "./errorhandler/application.error.js";
import userRouter from "./features/user/user.routs.js";
import authRouter from "./features/Auth/Auth.routs.js";
import bookingRouter from "./features/booking/booking.routs.js";
import flightRouter from "./features/flight/flight.routs.js";
import { jwtAuth } from "./middleware.js/jwt.auth.js";
import seatRouter from "./features/seat/seat.routes.js";
import paymentRouter from "./features/payment/payment.routes.js";
import reservationRouter from "./features/reservation/reservation.routes.js";
import cors from "cors";

const app=express();
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
}));

app.use(express.json());
app.use("/image",express.static("images"))

app.use("/api/auth/user",authRouter)
app.use("/api/user",jwtAuth,userRouter);
app.use("/api/flights",flightRouter);
app.use("/api/bookings",jwtAuth,bookingRouter);
app.use("/api/seats",seatRouter);
app.use("/api/payment",paymentRouter)
app.use("/api/reserve",reservationRouter)

app.use((error,req,res,next)=>{
   if(error instanceof ApplicationError){
    return res.status(error.code).send(error.message);
   }else{
     return res.status(500).send(error.message);
   }
}
)

export default app;