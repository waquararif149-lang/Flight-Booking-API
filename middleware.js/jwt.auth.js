import jwt from "jsonwebtoken";

export const jwtAuth=async(req,res,next)=>{
    const token=req.headers["authorization"];
    if(!token){
        res.status(400).send("unauthorized:token not provided")
    }
    try{
      const payload=jwt.verify(token,process.env.SECRET_KEY);
    req.userId=payload.userId;
    req.role=payload.role;
    next();
    }catch(err){
        res.status(400).send('unauthorized:token expired');
    }
}