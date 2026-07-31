import { useState } from "react";
import "./paymentPage.css";
import { createOrder, verifyPayment } from "../services/api.js";

function PaymentPage() {
  const [reservationId, setReservationId] = useState("");

  const [passengers, setPassengers] = useState([
    {
      name: "",
      age: "",
      gender: "Male",
      passportNumber: "",
    },
  ]);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      {
        name: "",
        age: "",
        gender: "Male",
        passportNumber: "",
      },
    ]);
  };

  const removePassenger = (index) => {
    const updatedPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(updatedPassengers);
  };

  const handlePayment = async () => {
    try {

      const orderResponse = await createOrder(reservationId);

      const order = orderResponse.data.order;

      const options = {

        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "Flight Booking",

        description: "Flight Ticket",

        order_id: order.id,

        handler: async function (response) {
          console.log(`from frontend: ${response}`);

          await verifyPayment({

            reservationId,

            passengers,

            orderId: response.razorpay_order_id,

            razorpayPaymentId: response.razorpay_payment_id,

            paymentId:order.paymentId,

            signature: response.razorpay_signature

          });

          alert("Payment Successful");

        },

        prefill: {

          name: passengers[0].name

        },

        theme: {

          color: "#2563eb"

        }

      };

      const rzp = new window.Razorpay(options);

      rzp.open();

    } catch (err) {

     console.log(err);

      alert("Payment Failed");

    }
  };

  return (
    <div className="container">
      <h2 className="title">Flight Booking Payment Demo</h2>

      <div className="form-group">
        <input
          className="input"
          type="text"
          placeholder="Reservation ID"
          value={reservationId}
          onChange={(e) => setReservationId(e.target.value)}
        />
      </div>

      {passengers.map((passenger, index) => (
        <div className="passenger-card" key={index}>
          <h3 className="passenger-title">
            Passenger {index + 1}
          </h3>

          <div className="form-group">
            <input
              className="input"
              type="text"
              placeholder="Name"
              value={passenger.name}
              onChange={(e) =>
                handlePassengerChange(index, "name", e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <input
              className="input"
              type="number"
              placeholder="Age"
              value={passenger.age}
              onChange={(e) =>
                handlePassengerChange(index, "age", e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <select
              className="select"
              value={passenger.gender}
              onChange={(e) =>
                handlePassengerChange(index, "gender", e.target.value)
              }
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <input
              className="input"
              type="text"
              placeholder="Passport Number"
              value={passenger.passportNumber}
              onChange={(e) =>
                handlePassengerChange(
                  index,
                  "passportNumber",
                  e.target.value
                )
              }
            />
          </div>

          {index > 0 && (
            <button
              className="btn btn-danger"
              onClick={() => removePassenger(index)}
            >
              Remove Passenger
            </button>
          )}
        </div>
      ))}

      <div className="button-row">
        <button
          className="btn btn-success"
          onClick={addPassenger}
        >
          + Add Passenger
        </button>
      </div>

      <button
        className="pay-btn"
        onClick={handlePayment}
      >
        Pay Now
      </button>
    </div>
  );
}

export default PaymentPage;