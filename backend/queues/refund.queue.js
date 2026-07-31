import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

export const refundQueue=new Queue("refund-queue",{connection:redisConnection});