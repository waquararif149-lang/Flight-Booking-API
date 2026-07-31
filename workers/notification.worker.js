import { Worker } from "bullmq";
import handleEmailJob from "../handlers/email.handler.js";
import redisConnection from "../config/redis.js";
import connectDB from "../config/db.js";

await connectDB();

const worker=new Worker("email-queue",
    async(job)=>{
       console.log("worker recive the job");
       await handleEmailJob(job);
    },
    {connection:redisConnection}
)