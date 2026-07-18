import mongoose from "mongoose";
import BookingRepository from "./booking.repositroy.js";
import seatRepo from "../seat/seat.repositotry.js";
import flightRepository from "../flight/flight.repository.js";
import { generateBookingRef } from "../../utils/other/booking.reference.js";

export default class bookingService{
    constructor(){
      this.bookingrepo=new BookingRepository();
      this.seatrepo=new seatRepo();
      this.flightrepo=new flightRepository();
    }

   async createBooking(bookingData){
      const session=await mongoose.startSession();
      try{
        session.startTransaction();
        //all databse opration 
        const availableSeats=await this.seatrepo.findAvailableSeats(
            bookingData.flightId,
            bookingData.seatNumbers,
        )
        if(availableSeats.length!==bookingData.seatNumbers.length){
            throw new Error("One or more seats are already booked.");
        }
        await this.seatrepo.updateSeatStatus(
            bookingData.flightId,
            bookingData.seatNumbers,
            "Booked",
            session
        )
        await this.flightrepo.updateAvailableSeats(
          bookingData.flightId,
          -bookingData.seatNumbers.length,
          session
        );
        const bookingRef=generateBookingRef();
        const createdBooking = await this.bookingrepo.createBooking({
          ...bookingData,
          bookingReference: bookingRef
        }, session);
        await session.commitTransaction();
        return createdBooking;
      }catch(err){
        await session.abortTransaction();
        throw err;
      }finally{
        session.endSession();
      }
   }

}