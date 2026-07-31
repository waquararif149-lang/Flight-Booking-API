import mongoose from "mongoose";
import razorpay from "../../config/razorpay.js";
import ApplicationError from "../../errorhandler/application.error.js";
import { generateSignature } from "../../utils/other/signature.js";
import reservationRepo from "../reservation/reservation.repo.js"
import paymentRepo from "./payment.repository.js";
import reservationService from "../reservation/reservation.service.js";
import reservationQueueService from "../../services/reservationQueue.service.js";
import refundService from "../../services/refund.service.js";

export default class paymentService {
    constructor() {
        this.reservationrepo = new reservationRepo();
        this.paymentrepo = new paymentRepo();
        this.reservationservice = new reservationService();
        this.reservationqueueservice = new reservationQueueService();
        this.refundservice=new refundService();
    }

    async createOrder(reservationId) {
        const reservation = await this.reservationrepo.getReservationById(reservationId);
        if (!reservation) {
            throw new ApplicationError("reservation not found", 404);
        }
        const data = {
            reservationId,
            userId: reservation.userId,
            amount: reservation.totalAmount,
            status: "pending"
        }
        const payment = await this.paymentrepo.createPayment(data);
        console.log("Creating Razorpay Order...");
        const order = await razorpay.orders.create({
            amount: reservation.totalAmount * 100,   // Razorpay expects amount in paise
            currency: "INR",
            receipt: reservationId.toString(),   // your unique reference
            notes: {
                reservationId: reservationId.toString()
            }
        });
        await this.paymentrepo.updatePayment(payment._id, { razorpayOrderId: order.id });
        return {
            ...order,
            paymentId: payment._id
        };
    }

    // async verifyOrder(data) {
    //     console.log("verifyorder is called")
    //     console.log(data);
    //     const session = await mongoose.startSession();
    //     try {
    //         await session.startTransaction();
    //         console.log("payment repo is called")
    //         const payment = await this.paymentrepo.getPaymentById(data.paymentId);
    //         console.log(payment)
    //         const signature = data.signature;
    //         const razorpayPaymentId = data.razorpayPaymentId || data.paymentId;
    //         const generatedSignature = generateSignature(data.orderId, razorpayPaymentId);
    //         if (generatedSignature !== signature) {
    //             //call to the paymentrepo and update the paymentstatus pending->failed
    //             await this.paymentrepo.updatePayment(payment._id, { status: "failed" }, session)
    //             throw new ApplicationError("invalid payment signature", 400)
    //         }
    //         await this.paymentrepo.updatePayment(
    //             payment._id,
    //             {
    //                 status: "paid",
    //                 razorpaySignature: signature,
    //                 razorpayPaymentId: razorpayPaymentId,
    //                 razorpayOrderId: data.orderId
    //             },
    //             session);
    //         const reservation = await this.reservationrepo.getReservationById(data.reservationId);
    //         console.log("confirmreservation is called");
    //         const booking = await this.reservationservice.confirmReservation(reservation._id, data.passengers, session);
    //         if (!booking) {
    //             //update the payment document status i.e pending->refund initiated
    //             //call the refund initiate api 
    //             throw new ApplicationError("booking could not be created", 500);
    //         }
    //         await this.paymentrepo.updatePayment(
    //             payment._id,
    //             { bookingId: booking._id },
    //             session
    //         )
    //         console.log("removereservationexpiry is called");
    //         await this.reservationqueueservice.removeReservationExpiry(data.reservationId);
    //         await session.commitTransaction();
    //         return booking;
    //     } catch (err) {
    //         await session.abortTransaction();
    //         throw err;
    //     } finally {
    //         session.endSession();
    //     }
    // }

    async verifyOrder(data) {
        // verify signature
        console.log("verifyorder is called")
        const payment = await this.paymentrepo.getPaymentById(data.paymentId);

        if (!payment) {
            throw new ApplicationError("payment not found", 404);
        }

        const signature = data.signature;
        const razorpayPaymentId = data.razorpayPaymentId || data.paymentId;
        const generatedSignature = generateSignature(data.orderId, razorpayPaymentId);
        if (generatedSignature !== signature) {
            await this.paymentrepo.updatePayment(payment._id, { status: "failed" })
            throw new ApplicationError("invalid payment signature", 400)
        }
        console.log("paid status is called")
        await this.paymentrepo.updatePayment(
            payment._id,
            {
                status: "paid",
                razorpaySignature: signature,
                razorpayPaymentId: razorpayPaymentId,
                razorpayOrderId: data.orderId
            }
        );

        const session = await mongoose.startSession();

        try {
            await session.startTransaction();
            console.log("reservationrepo inside transaction is called")
            const reservation = await this.reservationrepo.getReservationById(data.reservationId);

            if (!reservation) {
                throw new ApplicationError("Reservation not found", 404);
            }
            console.log("confirmreservation is called")
            const booking = await this.reservationservice.confirmReservation(reservation._id, data.passengers, session);
            console.log("attatch bookingId is called")
            await this.paymentrepo.updatePayment(
                payment._id,
                {
                    bookingId: booking._id
                },
                session
            );

            await session.commitTransaction();

        } catch (err) {

            await session.abortTransaction();
            console.log("refund_status is called")
            await this.paymentrepo.updatePayment(
                payment._id,
                {
                    status: "refund_initiated"
                }
            );

            // refund api
            console.log("refund api is called");
            await this.refundservice.initiateRefund({paymentId:payment._id});
            throw err;

        } finally {

            await session.endSession();

        }
        console.log("removereservationexpiry is called")
        await this.reservationqueueservice.removeReservationExpiry(data.reservationId);
    }

    async initiateRefund(paymentId){
        console.log("initiate refund is called");
        // Get payment
           const payment=await this.paymentrepo.getPaymentById(paymentId);
        // Check payment.status == "refund_initiated"
           if(payment.status!="refund_initiated"){
              throw new ApplicationError("Refund has not been initiated",400);
           }
        // Call Razorpay Refund API
        console.log("razorpay refund api is called");
         const refund=await razorpay.payments.refund(
            payment.razorpayPaymentId
         )
        // Update payment
        console.log("upadte payment is called");
          await this.paymentrepo.updatePayment(paymentId,
            {
                status:"refunded",
                refundAmount:payment.amount,
                razorpayRefundId:refund.id
            }
        );
       // Return refund response  
          return refund;
    }
}