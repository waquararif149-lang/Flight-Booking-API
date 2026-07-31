import { generateSeats } from "../../utils/other/seat.generator.js";
import seatService from "../seat/seat.service.js";
import flightRepository from "./flight.repository.js"

export default class flightService{

    constructor(){
        this.flightrepository=new flightRepository();
        this.seatservice=new seatService();
    }
  
    async createFlight(data){
       const totalSeats=data.seatsPerRow*data.totalRows;
       const availableSeats=totalSeats;
       const flight=await this.flightrepository.createFlight({...data,totalSeats,availableSeats});
       const seats=generateSeats(flight._id,data.totalRows,data.seatsPerRow);
       await this.seatservice.createSeat(seats);
       return flight;
    }
  
}