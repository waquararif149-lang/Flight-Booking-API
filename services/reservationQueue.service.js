import { reservationQueue } from "../queues/reservation.queue.js";

export default class reservationQueueService{

    async scheduleReservationExpiry(data){
       await reservationQueue.add("expire-job",
          data,
          {
            jobId:data.reservationId.toString(),
            delay:2*60*1000,
            attempts:3,
                backoff:{
                    type:"exponential",
                    delay:2000
                },
                removeOnComplete:true
          }
       )
    }

    async removeReservationExpiry(jobId){
      const job= await reservationQueue.getJob(jobId);
       if(job){
        await job.remove();
       }
    }
}