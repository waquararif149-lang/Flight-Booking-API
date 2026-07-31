import { reservationModel } from "./reservation.schema.js";

export default class reservationRepo{
    
    async createReservation(data,session){
       const result= await reservationModel.create([data],{session});
       return result[0];
    }

    async getReservationById(reservationId,session){
       return await reservationModel.findById(reservationId,null,{session});
    }

    async getReservationByUser(userId){
       return await reservationModel.find({userId});
    }

    async deleteReservation(reservationId,session){
       await reservationModel.findByIdAndDelete(reservationId,{session});
    }
}