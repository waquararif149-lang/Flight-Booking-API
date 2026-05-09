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
import { transporter } from "../../utils/nodemailer.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let cancleHTMLTemplete = await fs.readFile(
  path.join(__dirname, "../../utils/cancleEmail.html"),
  'utf-8'
)
let bookingHTMLTemplete = await fs.readFile(
  path.join(__dirname, "../../utils/bookingEmail.html"),
  'utf-8'
)

export default class BookingRepository {

  async createBooking(data) {
    try {
      const user = await userModel.findById(data.userId);
      const flight = await flightModel.findById(data.flightId);
      const newBooking = await bookingModel.create(data);
      newBooking.save();
      await flightModel.findByIdAndUpdate(
        data.flightId,
        {
          $inc: { availableSeats: -data.seatNumbers.length }
        }
      );
      this.sendBookingConfirmationEmail(newBooking, user, flight);
    } catch (err) {
      throw new ApplicationError(err);
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

  async bookingCancleRequest(bookingId) {
    await bookingModel.findByIdAndUpdate(
      bookingId,
      {
        $set: { status: "cancle_request" }
      }
    )
  }

  async handleCancleRequest() {
    const session = await mongoose.startSession();
    session.startTransaction();
    let cancelledBookings = [];
    try {
      const bookings = await bookingModel.find({ status: "cancle_request" }, null, { session });

      if (bookings.length > 0) {
        //increase available seats
        for (let i = 0; i < bookings.length; i++) {
          await flightModel.findByIdAndUpdate(
            bookings[i].flightId,
            { $inc: { availableSeats: bookings[i].seatNumbers.length } },
            { session }
          )

          //updating booking status
          await bookingModel.findByIdAndUpdate(
            bookings[i]._id,
            { status: "cancelled" },
            { session }
          )

          const user = await userModel.findById(bookings[i].userId);
          cancelledBookings.push({
            email: user.email,
          })

        }
        await session.commitTransaction();
        session.endSession();
      }
    } catch (err) {
      await session.abortTransaction();
      session.endSession()
      throw new ApplicationError(err);
    }
    try {
      for (let item of cancelledBookings) {
        await this.sendCancelConfirmationEmail(item.email);
      }
    } catch (err) {
      throw new ApplicationError(err);
    }
  }


  async sendCancelConfirmationEmail(email) {

    //config email content
    const mailpoint = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'regarding cancling booking',
      html: cancleHTMLTemplete
    }
    try {
      const res = await transporter.sendMail(mailpoint);
      console.log("mail sent successfully");
    } catch (err) {
      throw new ApplicationError(err);
    }
  }

  async sendBookingConfirmationEmail(booking, user, flight) {

    const departureDateTime = new Date(flight.departureDate).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    const htmlContent = bookingHTMLTemplete
      .replace("{{USER_NAME}}", user.name)
      .replace("{{BOOKING_ID}}", booking._id)
      .replace("{{FLIGHT_NUMBER}}", flight.flightNumber)
      .replace("{{SOURCE}}", flight.arrivalCity)
      .replace("{{DESTINATION}}", flight.departureCity)
      .replace("{{DEPARTURE_DATE}}", departureDateTime)
      .replace("{{SEAT_NUMBERS}}", booking.seatNumbers.join(", "));

    //config email content
    const mailpoint = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'regarding flight booking',
      html: htmlContent
    }
    try {
      const res = await transporter.sendMail(mailpoint);
      console.log("booking mail sent successfully");
    } catch (err) {
      throw new ApplicationError(err);
    }
  }
}