import ApplicationError from "../../errorhandler/application.error.js";
import { bookingModel } from "./booking.schema.js";
import flightModel from "../flight/flight.schema.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { userModel } from "../Auth/Auth.repositroy.js";
import dotenv from "dotenv";
import { transporter } from "../../utils/email/nodemailer.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let cancleHTMLTemplete = await fs.readFile(
  path.join(__dirname, "../../utils/email/cancleEmail.html"),
  'utf-8'
)
let bookingHTMLTemplete = await fs.readFile(
  path.join(__dirname, "../../utils/email/bookingEmail.html"),
  'utf-8'
)

export default class BookingRepository {

  async createBooking(data,session) {
    try {
      const user = await userModel.findById(data.userId);
      const flight = await flightModel.findById(data.flightId);

      if(!user || !flight){
        throw new ApplicationError("User or flight not found",404);
      }

      const totalAmount=data.seatNumbers.length*flight.price;
      const newBooking = await bookingModel.create([
        { ...data, totalAmount, bookingReference: data.bookingReference }
      ], { session });
      return newBooking[0];
      // this.sendBookingConfirmationEmail(newBooking, user, flight);
    } catch (err) {
      throw new ApplicationError(err.message || err,500);
    }
  }

  async getBookingById(bookingId) {
    try {
      return await bookingModel.findById(bookingId);
    } catch (err) {
      throw new ApplicationError(err);
    }
  }

  async fetchBookings(userId) {
    try {
      console.log(userId)
      return await bookingModel.findOne({ userId }).select({ _id: 0, userId: 0 });
    } catch (err) {
      throw new ApplicationError(err);
    }
  }

  async fetchAllBookings() {
    try {
      return await bookingModel.find({}).select({ _id: 0 });
    } catch (err) {
      throw new ApplicationError(err);
    }
  }

  
}