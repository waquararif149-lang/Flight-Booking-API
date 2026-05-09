import ApplicationError from "../../errorhandler/application.error.js";
import flightRepository from "./flight.repository.js";

export default class FlightControler{
    constructor(){
        this.flightrepository=new flightRepository();
    }

   //admin can create flight 
    async createFlight(req,res){
      try{
        const data={
            ...req.body,
            logo:req.file?req.file.filename:undefined
        }
        await this.flightrepository.createFlight(data);
        res.status(201).send("flight created")
      }catch(err){
         throw new ApplicationError(err);
      }
    }

    //admin can update flight
    async updateFlight(req,res){
       try{
         const flightId=req.params.id;
         const role=req.role;
         console.log(flightId,role)
         const updatedata={
           ...req.body,
           logo:req.file?req.file.filename:undefined
         }
         if(role==="admin"){
            await this.flightrepository.updateFlight(flightId,updatedata);
            res.status(200).send("flight updated");
         }else{
           res.status(400).send("flights can be updated only by admin");
         }
       }catch(err){
          throw new ApplicationError(err);
       }
    }

    //admin can delete flight
    async deleteFlight(req,res){
        try{
          const flightId=req.params.id;
          const role=req.role;
          if(role==="admin"){
            await this.flightrepository.deleteFlight(flightId);
            res.status(200).send("flight deleted")
          }else{
            res.status(400).send("flights can be deleted only by admin")
          }
        }catch(err){
          throw new ApplicationError(err);
        }
    }

    //user can filter or search flight
    async filterFlight(req,res){
        try{
           const {
          departureCity,
          airline,
          arivalCity,
          minPrice,
          maxPrice,
          departureDate,
          arivalDate,
          flightClass}=req.query;

          let query={};
          
          if(departureCity) query.departureCity=departureCity;
          if(airline) query.airline=airline;
          if(arivalCity) query.arivalCity=arivalCity;
          if(flightClass) query.flightClass=flightClass;
          if(minPrice!==undefined || maxPrice!==undefined){
             query.price={};
             if(minPrice) query.price.$gte=Number(minPrice);
             if(maxPrice) query.price.$lte=Number(maxPrice);
          }
          if(departureDate){
             const start=new Date(departureDate);
          const end=new Date(departureDate);
          end.setDate(end.getDate()+1);
          query.departureDate={
            $gte:start,
            $lt:end
          }
        }
        if(departureDate && arivalDate){
           query.departureDate={
             $gte:new Date(departureDate),
             $lt:new Date(arivalDate)
           }
        }
        const flight=await this.flightrepository.filterFlight(query);
        if(flight){
          res.status(200).send(flight);
        }else{
          res.status(400).send("no flight found for this filter")
        }
        }catch(err){
            throw new ApplicationError(err);
        }
    }

    //user can get flight by flightId
    async getFlightById(req,res){
        try{
          const flightId=req.params.id;
          const flight=await this.flightrepository.getFlightById(flightId);
          if(flight){
             res.status(200).send(flight);
          }else{
            res.status(400).send("no flights found");
          }
        }catch(err){
          throw new ApplicationError(err);
        }
    }
}