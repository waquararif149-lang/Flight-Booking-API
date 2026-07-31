import express from 'express';
import FlightControler from './flight.controler.js';
import { fileupload } from '../../middleware.js/multer.js';


const flightControler=new FlightControler();

const flightRouter=express.Router();

flightRouter.post("/",fileupload.single("logo"),(req,res)=>{
    flightControler.createFlight(req,res);
})
flightRouter.put('/:id',fileupload.single("logo"),(req,res)=>{
    flightControler.updateFlight(req,res);
})
flightRouter.get('/:id',(req,res)=>{
    flightControler.getFlightById(req,res);
})
flightRouter.delete('/:id',(req,res)=>{
    flightControler.deleteFlight(req,res);
})
flightRouter.get("/",(req,res)=>{
    flightControler.filterFlight(req,res);
})

export default flightRouter;