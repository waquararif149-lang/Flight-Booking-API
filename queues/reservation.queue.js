import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

export const reservationQueue=new Queue("resv-queue",{connection:redisConnection});