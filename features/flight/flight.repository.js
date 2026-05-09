import ApplicationError from "../../errorhandler/application.error.js";
import flightModel from "./flight.schema.js";

export default class flightRepository{

    async createFlight(data){
      try{
        const newFlight= new flightModel(data);
        await newFlight.save();
      }catch(err){
        throw new ApplicationError(err);
      }
    }

    async updateFlight(flightId,updatedata){
       try{
        await flightModel.findByIdAndUpdate(
         flightId,
         {
          $set:updatedata
         },
         {new:true}
       )
       }catch(err){
        throw new ApplicationError(err);
       }
    }

    async deleteFlight(flightId){
        try{
          await flightModel.findByIdAndDelete(flightId);
        }catch(err){
          throw new ApplicationError(err);
        }
    }

    async filterFlight(query){
        return await flightModel.find(query);
    }

    async getFlightById(flightId){
        try{
          const flight=await flightModel.findById(flightId);
          return flight;
        }catch(err){
          throw new ApplicationError(err);
        }
    }
}