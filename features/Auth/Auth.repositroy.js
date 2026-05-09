import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";

export const userModel=mongoose.model("User",userSchema);

export default class AuthRepo{

    async register(name,
            email,
            password,
            gender,role){
      const newUser=await userModel.create({name,
            email,
            password,
            gender,
            role});
      newUser.save();
    }

    async logout(){
        
    }


    async findByEmail(email){
       return await userModel.findOne({email:email});
    }
}