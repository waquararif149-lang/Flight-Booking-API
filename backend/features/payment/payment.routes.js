import express from "express";
import paymentControler from "./payment.controler.js";

const paymentcontroler=new paymentControler();

const paymentRouter=express.Router();

paymentRouter.post("/create-order",paymentcontroler.createOrder.bind(paymentcontroler));
paymentRouter.post("/verify-order",paymentcontroler.verifyPayment.bind(paymentcontroler));

export default paymentRouter;