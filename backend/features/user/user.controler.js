import ApplicationError from "../../errorhandler/application.error.js";
import userRepo from "./user.repository.js";

export default class UserControler{
   constructor(){
    this.userrepo=new userRepo();
   }

    async getUser(req,res){
        try{
         const user=await this.userrepo.getUser(req.userId);
         if(user){
           res.status(200).send(user);
         }else{
            res.status(400).send("user not found");
         }
        }catch(err){
            throw new ApplicationError(err);
        }
    }

    async updateUser(req,res){
       try{
          const allowdata=["email","name","password","gender","role"];
        const updatedata={};
        for(let field of allowdata){
            if(req.body[field]!==undefined){
                updatedata[field]=req.body[field]
            }
        }

        if(req.file){
           updatedata.profilePicture= `images/${req.file.filename}`;
        }
        await this.userrepo.updateUser(req.userId,updatedata);
        res.status(200).send("user profile updated")
       }catch(err){
          throw new ApplicationError(err);
       }
    }
}