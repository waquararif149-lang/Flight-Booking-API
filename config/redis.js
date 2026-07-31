import dotenv from "dotenv";
dotenv.config({path:"../.env"});
import Redis from "ioredis";

const redisOptions = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD,
    family: 4,
    lazyConnect: false,
    enableOfflineQueue: true,
    maxRetriesPerRequest: null,
    connectTimeout: 10000,
    retryStrategy(times) {
        return Math.min(times * 200, 3000);
    },
};

if (process.env.REDIS_TLS === "true") {
    redisOptions.tls = {};
}

const redisConnection = process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL, redisOptions)
    : new Redis(redisOptions);

redisConnection.on("connect", () => {
    console.log("✅ Redis Connected");
});

redisConnection.on("error", (err) => {
    console.error("❌ Redis Error:", err);
});

export default redisConnection;






// import Redis from "ioredis";

// const redisConnection = new Redis({
//     host: process.env.REDIS_HOST,
//     port: Number(process.env.REDIS_PORT),
//     password: process.env.REDIS_PASSWORD,
//     tls: {},
//     maxRetriesPerRequest: null,
// });

// redisConnection.on("connect", () => {
//     console.log("✅ Redis Connected");
// });

// redisConnection.on("error", (err) => {
//     console.error("❌ Redis Error:", err);
// });

// export default redisConnection;