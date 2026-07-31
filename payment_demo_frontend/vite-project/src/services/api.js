import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const createOrder = (reservationId) => {
    return api.post("/api/payment/create-order", {
        reservationId
    });
};

export const verifyPayment = (data) => {
    return api.post("/api/payment/verify-order", data);
};