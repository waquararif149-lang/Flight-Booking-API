import { seatModel } from "./seat.schema.js";

export default class seatRepo{

    async createSeat(seats){
       await seatModel.insertMany(seats);
    }

    async getSeatsByFlight(flightId){
       return await seatModel.find({flightId});
    }

    async findAvailableSeats(flightId, seatNumbers){
      return await seatModel.find({
          flightId,
          seatNumber:{$in:seatNumbers},
          status:"Available"
      })
    }

    async updateSeatStatus(flightId, seatNumbers, status,session){
       return await seatModel.updateMany(
         {
            flightId,
            seatNumber:{
               $in:seatNumbers
            }
         },
         {
            $set:{
               status
            }
         },
         {session}
       )
    }
}