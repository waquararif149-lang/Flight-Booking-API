import ApplicationError from "../../errorhandler/application.error.js";
import BookingRepository from "./booking.repositroy.js"

export default class BookingControler{
    constructor(){
        this.bookingRepository=new BookingRepository();
    }

    //creating new bookings
    async createBooking(req,res){
        try{
          const role=req.role;
          const userId=req.userId;
          const status="booked";
          if(role==="user"){
             const bookingData={...req.body,userId,status}
             await this.bookingRepository.createBooking(bookingData);
             res.status(201).send("booking created");
          }
        }catch(err){
            throw new ApplicationError(err);
        }
    }
    //user can fetch their bookings 
    async fetchBookings(req,res){
        try{
          const userId=req.userId;
          const bookings=await this.bookingRepository.fetchBookings(userId);
          if(bookings){
            res.status(200).send(bookings);
          }else{
            res.status(400).send("no bookings found");
          }
        }catch(err){
            throw new ApplicationError(err);
        }
    }

    //get bookings by id
    async getBookingById(req,res){
       try{
        const bookingId=req.params.id;
        const booking=await this.bookingRepository.getBookingById(bookingId);
        if(booking){
          res.status(200).send(booking);
        }else{
          res.status(400).send("no booking found!");
        }
       }catch(err){
         throw new ApplicationError(err);
       }
    }

    //admin can fetch all bookings done by user for further process
    async fetchAllBookings(req,res){
       try{
         const role=req.role;
         if(role==="admin"){
            const bookings=await this.bookingRepository.fetchAllBookings();
            if(bookings){
                res.status(200).send(bookings);
            }else{
                res.status(400).send("no bookings found");
            }
         }else{
            res.status(401).send("only admin can fetch all boolings");
         }
       }catch(err){
          throw new ApplicationError(err);
       }
    }

    //user can raise their cancle request
    async bookingCancleRequest(req,res){
        try{
          const bookingId=req.params.id;
          await this.bookingRepository.bookingCancleRequest(bookingId);
          res.status(200).send("cancle request send");
        }catch(err){
            throw new ApplicationError(err);
        }
    }

    //only admin can handle the canclled requests
    async handleCancleRequest(req,res){
        try{
          const role=req.role;
          if(role==="admin"){
             await this.bookingRepository.handleCancleRequest();
             res.status(200).send("successfully handled booking cancle_request");
          }else{
            res.status(401).send("this service is only for admin");
          }
        }catch(err){
            throw new ApplicationError(err);
        }
    }

}