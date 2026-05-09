import { userModel } from "../Auth/Auth.repositroy.js";
import ApplicationError from "../../errorhandler/application.error.js";

export default class userRepo{


    async getUser(userId){
       try{
          return await userModel.findById(userId);
       }catch(err){
          throw new ApplicationError(err);
       }
    }

    async updateUser(userId,updatedata){
       try{
          await userModel.findByIdAndUpdate(
            userId,
            {
               $set:updatedata
            },
            {new:true}
         )
       }catch(err){
         throw new ApplicationError(err);
       }
    }
}