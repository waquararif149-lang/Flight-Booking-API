import { paymentModel } from "./payment.schema.js";

export default class paymentRepo {
    constructor() {

    }

    async createPayment(data) {
        return await paymentModel.create(data);
    }

    async updatePayment(paymentId, updateData, session = null) {

        const options = {
            new: true
        };

        if (session) {
            options.session = session;
        }

        return await paymentModel.findByIdAndUpdate(
            paymentId,
            {
                $set: updateData
            },
            options
        );
    }

    async getPaymentById(id) {
        return await paymentModel.findById(id);
    }
}