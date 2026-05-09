import UserControler from "./user.controler.js";
import express from "express";
import { fileupload } from "../../middleware.js/multer.js";

const usercontroler=new UserControler();

const userRouter=express.Router();

userRouter.get("/",(req,res)=>{
    usercontroler.getUser(req,res);
})

userRouter.post("/profile",fileupload.single("profilePicture"),(req,res)=>{
    usercontroler.updateUser(req,res);
})

export default userRouter;