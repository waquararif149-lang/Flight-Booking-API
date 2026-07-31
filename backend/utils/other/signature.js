import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const generateSignature = (orderId,paymentId) => {
   return crypto
            .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
            .update(orderId + "|" + paymentId)
            .digest("hex")
}