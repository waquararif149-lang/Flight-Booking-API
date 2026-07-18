import jwt from "jsonwebtoken";

export const jwtAuth=async(req,res,next)=>{
    const token=req.headers["authorization"];
    if(!token){
        return res.status(400).send("unauthorized:token not provided")
    }
    try{
      const payload=jwt.verify(token,process.env.SECRET_KEY);
      req.userId=payload.userId;
      req.role=payload.role;
      return next();
    }catch(err){
        return res.status(400).send('unauthorized:token expired');
    }
}