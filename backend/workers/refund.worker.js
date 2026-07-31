import { Worker } from "bullmq";
import redisConnection from "../config/redis.js";
import paymentService from "../features/payment/payment.service.js"; 
import connectDB from "../config/db.js";

await connectDB();

const paymentservice=new paymentService();

const refundWorker=new Worker("refund-queue",
    async(job)=>{
       console.log("worker recieve the job");
       await paymentservice.initiateRefund(job.data.paymentId);
    },
    {connection:redisConnection}
)

refundWorker.on("completed", (job) => {
    console.log(`job ${job.id} completed`);
});
refundWorker.on("failed", (job, err) => {
    console.error(`job ${job?.id} failed`, err);
});
refundWorker.on("error", (err) => {
    console.error("worker error:", err);
});