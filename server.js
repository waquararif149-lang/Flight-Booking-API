import app from "./index.js";
import connectDB from "./config/db.js";
import redisConnection from "./config/redis.js";

import "./workers/notification.worker.js";
import "./workers/refund.worker.js";
import "./workers/reservation.worker.js";

(async () => {
    await redisConnection.set("test", "Hello Redis");

    const value = await redisConnection.get("test");

    console.log(value);
})();

app.listen(3000,()=>{
  console.log("app is listining on 3000")
  connectDB();
})

