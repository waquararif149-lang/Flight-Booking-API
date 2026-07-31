import { emailQueue } from "../queues/email.queue.js";

export default class notificationService{

    async sendWelcomeEmail(data){
       await emailQueue.add("welcome-email",
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

    async sendBookingConfirmationEmail(data){
        await emailQueue.add("bookingConfirm-email",
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