import crypto from "crypto";

export const generateBookingRef=()=>{
  const bookingRef=`BK-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  return bookingRef;
}