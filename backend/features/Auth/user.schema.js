import mongoose from "mongoose"

export const userSchema=new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true,
    validate:{
       validator:function(v){
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      },
      message:"please enter valid email"
    }
   },
   password:{
    type:String,
    required:true
   },
   gender:{
    type:String,
    required:true
   },
   role:{
     type:String,
     enum:["admin","user"],
     default:"user"
   },
   profilePicture:{
     type:String,
   },
   createdAt:{
     type:Date,
     default:Date.now()
   }
})