import PDFDocument from "pdfkit";

export const generateTicketPdf = (ticketData) => {
    return new Promise((resolve, reject) => {

        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        const buffers = [];

        doc.on("data", buffers.push.bind(buffers));

        doc.on("end", () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });

        doc.on("error", reject);

        // ===========================
        // Header
        // ===========================

        doc
            .fillColor("#1E40AF")
            .fontSize(24)
            .text("FLIGHT E-TICKET", {
                align: "center"
            });

        doc.moveDown();

        doc
            .fillColor("black")
            .fontSize(18)
            .text(ticketData.airlineName, {
                align: "center"
            });

        doc.moveDown(2);

        // ===========================
        // Passenger Details
        // ===========================

        doc
            .fontSize(16)
            .fillColor("#1E40AF")
            .text("Passenger Details");

        doc.moveDown(0.5);

        ticketData.passengers.forEach((passenger, index) => {

            doc
                .fontSize(12)
                .fillColor("black")
                .text(`Passenger ${index + 1}`);

            doc.text(`Name : ${passenger.name}`);
            doc.text(`Age : ${passenger.age}`);
            doc.text(`Gender : ${passenger.gender}`);
            doc.text(`Passport : ${passenger.passportNumber}`);
            doc.text(`Seat : ${passenger.seatNumber}`);

            doc.moveDown();
        });

        // ===========================
        // Flight Details
        // ===========================

        doc
            .fontSize(16)
            .fillColor("#1E40AF")
            .text("Flight Details");

        doc.moveDown(0.5);

        doc
            .fillColor("black")
            .fontSize(12)
            .text(`Booking ID : ${ticketData.bookingId}`);

        doc.text(`PNR : ${ticketData.bookingReference}`);

        doc.text(`Flight Number : ${ticketData.flightNumber}`);

        doc.text(`From : ${ticketData.source}`);

        doc.text(`To : ${ticketData.destination}`);

        doc.text(`Departure : ${ticketData.departureDate}`);

        doc.text(`Arrival : ${ticketData.arrivalDate}`);

        doc.text(`Amount Paid : ₹${ticketData.amount}`);

        doc.moveDown(2);

        // Divider

        doc
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke();

        doc.moveDown();

        doc
            .fillColor("#16A34A")
            .fontSize(15)
            .text("✓ Booking Confirmed", {
                align: "center"
            });

        doc.moveDown();

        doc
            .fillColor("gray")
            .fontSize(10)
            .text(
                "Please carry a valid government ID while boarding.\nReport at the airport at least 2 hours before departure.",
                {
                    align: "center"
                }
            );

        doc.end();

    });
};