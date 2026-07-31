import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Render env vars.");
}

const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret
});

export default razorpay;