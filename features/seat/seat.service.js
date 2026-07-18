import seatRepo from "./seat.repositotry.js"

export default class seatService{

    constructor(){
        this.seatrepository=new seatRepo();
    }

    async createSeat(seats){
      await this.seatrepository.createSeat(seats);
    }

    async getSeatsByFlight(flightId){
      return await this.seatrepository.getSeatsByFlight(flightId);
    }
}