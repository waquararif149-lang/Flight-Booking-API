
import ApplicationError from "../../errorhandler/application.error.js";
import AuthRepo from "./Auth.repositroy.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRETKEY=process.env.SECRET_KEY;

export default class AuthControler{
  constructor(){
    this.userRepository=new AuthRepo();
  }

    async register(req,res){
        try{
          const {name,email,password,gender,role}=req.body;
        const hashpassword=await bcrypt.hash(password,12);
       await this.userRepository.register(name,
            email,
            hashpassword,
            gender,
            role
          );
       res.status(201).send("registration successfull");
        }catch(err){
          throw new ApplicationError(err);
        }
    }

    async login(req,res){
      const {email,password}=req.body;
       const user=await this.userRepository.findByEmail(email)
       if(user){
         const result=await bcrypt.compare(password,user.password);
         if(!result){
            res.status(400).send("invalid credentials");
         }else{
            const token=jwt.sign(
              {userId:user.id,userEmail:user.email,role:user.role},
              SECRETKEY,
              {expiresIn:"1h"}
            )
            res.status(200).send(token);
         }
       }
    }

    async userProfile(req,res){
       const user=this.userRepository.userDetail()
    }
}