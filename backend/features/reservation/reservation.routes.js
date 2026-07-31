import express from "express";
import reservationControler from "./reservation.controler.js";

const reservationcontroler=new reservationControler();

const reservationRouter=express.Router();

reservationRouter.post("/seats",reservationcontroler.reserveSeats.bind(reservationcontroler));


export default reservationRouter;
