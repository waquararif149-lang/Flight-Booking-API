import { refundQueue } from "../queues/refund.queue.js";

export default class refundService {

    async initiateRefund(data) {
        await refundQueue.add("refund-job",
            data,
            {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 2000
                },
                removeOnComplete: true
            }
        )
    }
}