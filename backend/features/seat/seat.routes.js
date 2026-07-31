import express from "express";
import seatControler from "./seat.controler.js";

const seatcontroler=new seatControler();

const seatRouter=express.Router();

seatRouter.get("/:flightId",seatcontroler.getSeatsByFlight.bind(seatcontroler));

export default seatRouter;