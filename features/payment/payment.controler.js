import paymentService from "./payment.service.js";

export default class paymentControler {
    constructor() {
        this.paymentservice = new paymentService();
    }

    async createOrder(req, res) {
        try {
            const { reservationId } = req.body;
           const order= await this.paymentservice.createOrder(reservationId);
           res.status(201).json({
             "success":true,
             "message":"order created successfully",
             order
           })
        } catch (err) {
            console.log(err);
            res.status(400).json({
                "success": false,
                "message": err.message
            })
        }
    }

    async verifyPayment(req, res) {
        try{
          const {
            reservationId,
            paymentId,
            razorpayPaymentId,
            orderId,
            signature,
            passengers
          }=req.body;
          const booking=await this.paymentservice.verifyOrder({
            reservationId,
            paymentId,
            razorpayPaymentId,
            orderId,
            signature,
            passengers
        });
        res.status(200).json({
            "success":true,
            "message":"booking conffirmed",
            booking
        })
        }catch(err){
            res.status(400).json({
                "success": false,
                "message": err.message
            })
        }
    }
}