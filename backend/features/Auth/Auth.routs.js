import AuthControler from "./Auth.controler.js";
import express from "express";

const authcontroler=new AuthControler();

const authRouter=express.Router();

authRouter.post("/register",(req,res)=>{
    authcontroler.register(req,res);
})

authRouter.post("/login",(req,res)=>{
    authcontroler.login(req,res);
})

export default authRouter;