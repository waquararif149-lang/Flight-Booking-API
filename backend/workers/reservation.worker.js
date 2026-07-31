// import dotenv from "dotenv";
// dotenv.config();

import { Worker } from "bullmq"
import redisConnection from "../config/redis.js"
import connectDB from "../config/db.js"
import reservationService from "../features/reservation/reservation.service.js"
import seatService from "../features/seat/seat.service.js"
import flightService from "../features/flight/flight.service.js"

// Connect to MongoDB before starting the worker
await connectDB();

const seatservice = new seatService();
const reservationservice = new reservationService();
const flightservice = new flightService();

const worker = new Worker(
    "resv-queue",
    async (job) => {
        console.log("worker received job");
        await reservationservice.expireReservation(job.data.reservationId);
    },
    {
        connection: redisConnection,
    }
);

worker.on("completed", (job) => {
    console.log(`job completed`);
});
worker.on("failed", (job, err) => {
    console.error(`job failed`, err);
});
worker.on("error", (err) => {
    console.error("worker error:", err);
});