import ApplicationError from "../errorhandler/application.error.js";
import emailService from "../services/email.service.js";
import { EMAIL_JOB } from "../utils/other/job.constants.js";

const handlers={
    [EMAIL_JOB.WELCOME]:emailService.sendWelcomeEmail.bind(emailService),
    [EMAIL_JOB.BOOKING_CONFIRMATION]:emailService.bookingConfirmationEmail.bind(emailService)
}

const handleEmailJob=async(job)=>{
   const handler=handlers[job.name];
   if(!handler){
      throw new ApplicationError(`unknown job type ${job.name}`)
   }
   await handler(job.data);
   console.log(`email service called from handler: ${handler}`);
}

export default handleEmailJob;