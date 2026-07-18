import express from "express";
import BookingControler from "./booking.controler.js";

const bookingRouter=express.Router();

const bookingControler=new BookingControler();

bookingRouter.post("/:flightId",(req,res)=>{
    return bookingControler.createBooking(req,res);
})
bookingRouter.get('/fetch',(req,res)=>{
    bookingControler.fetchBookings(req,res)
})
bookingRouter.get('/:id',(req,res)=>{
    bookingControler.getBookingById(req,res);
})
bookingRouter.get('/fetchall',(req,res)=>{
    bookingControler.fetchAllBookings(req,res)
})
bookingRouter.post('/cancle/:id',(req,res)=>{
    bookingControler.bookingCancleRequest(req,res);
})
bookingRouter.delete('/delete',(req,res)=>{
    bookingControler.handleCancleRequest(req,res);
})

export default bookingRouter;