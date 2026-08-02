import flightRepository from "../features/flight/flight.repository.js";
import userRepo from "../features/user/user.repository.js";
import fs from "fs/promises";
import welcomeTemplate from "../utils/email/welcomeEmail.template.js";
import resend from "../config/resend.js";
import bookingEmail from "../utils/email/bookingEmail.template.js";
import { generateTicketPdf } from "../utils/other/generateTicketPdf.js";

class EmailService {

    constructor() {
        this.flightrepo = new flightRepository();
        this.userrepo = new userRepo();
    }

    async sendWelcomeEmail(data) {
        try {
            const mailOptions = {
                from: "Flight Booking System <onboarding@resend.dev>",
                to: data.email,
                subject: "Welcome to our Platform",
                html: welcomeTemplate(data.name)
            };

            // await this.transporter.sendMail(mailOptions);
            await resend.emails.send(mailOptions);

            console.log("Welcome email sent");

        } catch (err) {
            console.error("Error while sending email:");
            console.error(err);
            throw err;
        }
    }

    async bookingConfirmationEmail(data) {
        try {
            const flight = await this.flightrepo.getFlightById(data.flightId);
            const user = await this.userrepo.getUser(data.userId);
            //  const bookingHTML=await fs.readFile("../utils/email/bookingEmail.html");
            const tempData = {
                userName: user.name,
                bookingId: data.bookingId,
                flightNumber: flight.flightNumber,
                source: flight.departureCity,
                destination: flight.arrivalCity,
                departureDate: flight.departureDate,
                seatNumbers: data.seatNumbers
            }

            const ticketData = {
                airlineName: flight.airline,
                bookingId: data.bookingId,
                bookingReference: data.bookingReference,
                flightNumber: flight.flightNumber,
                source: flight.departureCity,
                destination: flight.arrivalCity,
                departureDate: flight.departureDate,
                arrivalDate: flight.arrivalDate,
                amount: data.totalAmount ?? 0,
                passengers: data.passengers
            }

            const pdfBuffer = await generateTicketPdf(ticketData);
            console.log("PDF buffer generated:", Buffer.isBuffer(pdfBuffer));

            const mailOptions = {
                from: "Flight Booking System <onboarding@resend.dev>",
                to: user.email,
                subject: "Booking Confirmation",
                html: bookingEmail(tempData),
                attachments: [
                    {
                        filename: `Ticket-${data.bookingReference}.pdf`,
                        content: pdfBuffer
                    }
                ]
            };

            const { error } = await resend.emails.send(mailOptions);
            if (error) {
                throw new Error(error.message || "Failed to send booking confirmation email");
            }

            console.log("bookingconfirmation email sent");

        } catch (err) {
            console.error("Error while sending email:");
            console.error(err);
            throw err;
        }
    }
}

export default new EmailService();