import ApplicationError from "../../errorhandler/application.error.js";
import seatService from "./seat.service.js"

export default class seatControler {
    constructor() {
        this.seatservice = new seatService();
    }

    async getSeatsByFlight(req, res) {
        try {
            const flightId = req.params.flightId;
            const seats = await this.seatservice.getSeatsByFlight(flightId);
            res.status(200).json({
                success: true,
                seats
            })
        } catch (err) {
            throw new ApplicationError(err.message, 500);
        }
    }

}