import app from "./index.js";
import connectDB from "./config/db.js";
import redisConnection from "./config/redis.js";

// import "./workers/notification.worker.js";
// import "./workers/refund.worker.js";
// import "./workers/reservation.worker.js";

const port = Number(process.env.PORT) || 3000;

(async () => {
    try {
        await redisConnection.set("test", "Hello Redis");
        const value = await redisConnection.get("test");
        console.log(value);
    } catch (err) {
        console.error("Redis connection failed:", err);
    }
})();

app.listen(port, "0.0.0.0", () => {
  console.log(`app is listening on ${port}`);
  connectDB().catch((err) => {
    console.error("Database connection failed:", err);
  });
});

