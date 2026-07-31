import reservationService from "./reservation.service.js";

export default class reservationControler{
    constructor(){
       this.reservationservice=new reservationService();
    }

    async reserveSeats(req,res){
      try{
        const {userId,flightId,seatNumbers}=req.body;
        // const userId=req.userId;
        const response=await this.reservationservice.reserveSeats({userId,flightId,seatNumbers});
        res.status(200).json({
            "success":true,
            "message":"you successfully reservered your seats",
            response
        })
      }catch(err){
        res.status(400).json({
            "success":false,
            "message":err.message
        })
      }
    }
    
    // async confirmReservation(req,res){
    //   try{
       
    //   }catch(err){
    //     res.status(400).josn({
    //         "success":false,
    //         "message":err.message
    //     })
    //   }
    // }

    async cancleReservation(req,res){
        
    }
}