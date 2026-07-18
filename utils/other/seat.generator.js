
export const generateSeats = (flightId, totalRows, seatsPerRow) => {
    const seatLetter = ["A", "B", "C", "D", "E", "F"];
    const seats = [];
    const seatTypeMap = {
    A: "Window",
    B: "Middle",
    C: "Aisle",
    D: "Aisle",
    E: "Middle",
    F: "Window"
   };

    for (let i = 1; i <= totalRows; i++) {
        for (let j = 0; j < seatLetter.length; j++) {
            const seat = {
                flightId,
                seatNumber: seatLetter[j]+i,
                seatType:seatTypeMap[seatLetter[j]],
                status: "Available"
            }
            seats.push(seat);
        }
    }
    return seats;
}