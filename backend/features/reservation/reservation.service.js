import mongoose from "mongoose";
import seatRepo from "../seat/seat.repositotry.js";
import reservationRepo from "./reservation.repo.js";
import flightRepository from "../flight/flight.repository.js";
import reservationQueueService from "../../services/reservationQueue.service.js";
import BookingRepository from "../booking/booking.repositroy.js";
import { generateBookingRef } from "../../utils/other/booking.reference.js";
import emailService from "../../services/email.service.js";
import notificationService from "../../services/notification.service.js";

export default class reservationService {

    constructor() {
        this.reservationrepo = new reservationRepo();
        this.seatrepo = new seatRepo();
        this.flightrepo = new flightRepository();
        this.reservationQueueservice = new reservationQueueService();
        this.bookingrepo = new BookingRepository();
        this.notificationservice=new notificationService();
    }

    async reserveSeats(data) {
        const session = await mongoose.startSession();
        let committed = false;
        try {
            await session.startTransaction();
            const seatNumbers = Array.isArray(data.seatNumbers)
                ? data.seatNumbers
                : typeof data.seatNumbers === "string"
                    ? data.seatNumbers.split(",").map((seat) => seat.trim()).filter(Boolean)
                    : [];

            if (seatNumbers.length === 0) {
                throw new Error("No seat numbers provided");
            }

            const uniqueSeatNumbers = [...new Set(seatNumbers)];
            const flightSeats = await this.seatrepo.getSeatsByFlight(data.flightId);
            const seatLookup = new Map(flightSeats.map((seat) => [seat.seatNumber, seat]));
            const unavailableSeats = uniqueSeatNumbers.filter((seatNumber) => {
                const seat = seatLookup.get(seatNumber);
                return !seat || seat.status !== "Available";
            });

            if (unavailableSeats.length > 0) {
                throw new Error(`Seat(s) ${unavailableSeats.join(", ")} are not available`);
            }

            await this.seatrepo.updateSeatStatus(data.flightId, uniqueSeatNumbers, "Reserved", session);
            await this.flightrepo.updateAvailableSeats(
                data.flightId,
                -uniqueSeatNumbers.length,
                session
            );

            const flight = await this.flightrepo.getFlightById(data.flightId);
            const totalAmount = flight.price * uniqueSeatNumbers.length;
            data = { ...data, seatNumbers: uniqueSeatNumbers, totalAmount };
            const reservation = await this.reservationrepo.createReservation(data, session);
            const reservationId = reservation._id;

            await session.commitTransaction();
            committed = true;

            try {
                await this.reservationQueueservice.scheduleReservationExpiry({ reservationId });
            } catch (queueErr) {
                await this.releaseReservation(reservationId);
                throw queueErr;
            }

            return reservationId;
        } catch (err) {
            if (!committed && session.inTransaction()) {
                await session.abortTransaction();
            }
            throw err;
        } finally {
            await session.endSession();
        }
    }

    async confirmReservation(reservationId, passengers, session = null) {
        //this is called after the payment succeeds
        const transactionSession = session ?? await mongoose.startSession();
        let committed = false;
        let useExternalSession = Boolean(session);
        try {
            if (!useExternalSession) {
                await transactionSession.startTransaction();
            }

            //     Retrieve the reservation.
            const reservation = await this.reservationrepo.getReservationById(
                reservationId,
                transactionSession
            )
            if (!reservation) {
                return null;
            }
            const bookingData = {
                userId: reservation.userId,
                flightId: reservation.flightId,
                seatNumbers: reservation.seatNumbers,
                totalAmount: reservation.totalAmount,
                passengers,
                bookingReference: generateBookingRef(),
                status: "Confirmed",
                paymentStatus: "Paid",
                refundAmount: 0
            };
            //     Create the booking document.
            const booking = await this.bookingrepo.createBooking(bookingData, transactionSession);
            //     Change seat status:Reserved → Booked
            await this.seatrepo.updateSeatStatus(
                reservation.flightId,
                reservation.seatNumbers,
                "Booked",
                transactionSession
            )
            //     Delete the reservation document.
            await this.reservationrepo.deleteReservation(
                reservation._id,
                transactionSession
            )
            if (!useExternalSession) {
                await transactionSession.commitTransaction();
                committed = true;
            }

            try {
                await this.reservationQueueservice.removeReservationExpiry(reservationId);
            } catch (queueErr) {
                console.error("Failed to remove reservation expiry job", queueErr);
            }
            //     Send confirmation email (later).
               await this.notificationservice.sendBookingConfirmationEmail({
                  bookingId:booking._id,
                  userId:reservation.userId,
                  flightId:reservation.flightId,
                  seatNumbers:reservation.seatNumbers.join(",")
               })
            //     Generate ticket/PDF (later).

            return booking;
        } catch (err) {
            if (!useExternalSession && !committed && transactionSession.inTransaction()) {
                await transactionSession.abortTransaction();
            }
            throw err;
        } finally {
            if (!useExternalSession) {
                await transactionSession.endSession();
            }
        }
    }

    async expireReservation(reservationId) {
        console.log("inside expireReservation")
        //bullmq automaticaly call this after time has expired
        this.releaseReservation(reservationId);
    }

    async cancelReservation(reservationId) {
        console.log("cancle reservation is called")
        this.releaseReservation(reservationId);
        await this.reservationQueueservice.removeReservationExpiry(reservationId);
    }

    async releaseReservation(reservationId) {
        console.log("inside releaseReservation")
        const session = await mongoose.startSession();
        let committed = false;
        try {
            await session.startTransaction();
            //   Retrieve the reservation.
            const reservation = await this.reservationrepo.getReservationById(
                reservationId,
                session
            )
            if (!reservation) {
                return;
            }
            //   Change seats status Reserved → Available:
            console.log("updateseatstatus is called")
            await this.seatrepo.updateSeatStatus(
                reservation.flightId,
                reservation.seatNumbers,
                "Available",
                session
            )
            //   Increase flight availableSeats.
            console.log("updateavailableseats is called")
            await this.flightrepo.updateAvailableSeats(
                reservation.flightId,
                reservation.seatNumbers.length,
                session
            )
            //   Delete the reservation document.
            console.log("deletereservation is called")
            await this.reservationrepo.deleteReservation(
                reservation._id,
                session
            )
            // Remove the delayed BullMQ job (because the reservation no longer exists).
            await session.commitTransaction();
            committed = true;
        } catch (err) {
            if (!committed && session.inTransaction()) {
                await session.abortTransaction();
            }
            throw err;
        } finally {
            await session.endSession();
        }
    }

}