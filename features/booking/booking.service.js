import mongoose from "mongoose";
import BookingRepository from "./booking.repositroy.js";
import seatRepo from "../seat/seat.repositotry.js";
import flightRepository from "../flight/flight.repository.js";
import { generateBookingRef } from "../../utils/other/booking.reference.js";
import ApplicationError from "../../errorhandler/application.error.js";

export default class bookingService{
    constructor(){
      this.bookingrepo=new BookingRepository();
      this.seatrepo=new seatRepo();
      this.flightrepo=new flightRepository();
    }

   async createBooking(bookingData){
      const session=await mongoose.startSession();
      let committed = false;
      try{
        await session.startTransaction();
        const seatNumbers = Array.isArray(bookingData.seatNumbers)
            ? bookingData.seatNumbers
            : typeof bookingData.seatNumbers === "string"
                ? bookingData.seatNumbers.split(",").map((seat) => seat.trim()).filter(Boolean)
                : [];

        if (seatNumbers.length === 0) {
            throw new Error("No seat numbers provided");
        }

        const uniqueSeatNumbers = [...new Set(seatNumbers)];
        const flightSeats = await this.seatrepo.getSeatsByFlight(bookingData.flightId);
        const seatLookup = new Map(flightSeats.map((seat) => [seat.seatNumber, seat]));
        const unavailableSeats = uniqueSeatNumbers.filter((seatNumber) => {
            const seat = seatLookup.get(seatNumber);
            return !seat || seat.status !== "Available";
        });

        if (unavailableSeats.length > 0) {
            throw new Error(`Seat(s) ${unavailableSeats.join(", ")} are not available`);
        }

        await this.seatrepo.updateSeatStatus(
            bookingData.flightId,
            uniqueSeatNumbers,
            "Booked",
            session
        )
        await this.flightrepo.updateAvailableSeats(
          bookingData.flightId,
          -uniqueSeatNumbers.length,
          session
        );
        const bookingRef=generateBookingRef();
        const createdBooking = await this.bookingrepo.createBooking({
          ...bookingData,
          seatNumbers: uniqueSeatNumbers,
          bookingReference: bookingRef
        }, session);
        await session.commitTransaction();
        committed = true;
        return createdBooking;
      }catch(err){
        if (!committed && session.inTransaction()) {
            await session.abortTransaction();
        }
        throw err;
      }finally{
        await session.endSession();
      }
   }

   async cancleBooking(userId,bookingId,reason){
      const session=await mongoose.startSession();
      try{
        session.startTransaction();
        const booking=await this.bookingrepo.getBookingById(bookingId);
        if(!booking || booking.userId!=userId){
          throw new ApplicationError("booking not found");
        }
        const flightId=booking.flightId;
        const seatNumbers=booking.seatNumbers;
        const count=seatNumbers.length;
        if(booking.status=="Cancelled"){
          throw new ApplicationError("booking already cancled");
        }
        await this.seatrepo.updateSeatStatus(
          flightId,
          seatNumbers,
          "Available",
          session
        );
        await this.flightrepo.updateAvailableSeats(
          flightId,
          count,
          session
        );
        const updatedData={
            status:"Cancelled",
            paymentStatus:"Refunded",
            refundAmount:booking.totalAmount,
            cancellationReason:reason
          }
        const result= await this.bookingrepo.updateBooking(
          bookingId,
          updatedData,
          session
        );
        await session.commitTransaction();
        return result;
      }catch(err){
        await session.abortTransaction();
        throw new ApplicationError(err,500);
      }finally{
         session.endSession();
      }
   }

}