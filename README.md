# ✈️ Flight Booking System

A production-inspired **Flight Booking Backend** built using **Node.js, Express.js, MongoDB, Redis, BullMQ, Razorpay, and Resend**. The project simulates how real-world airline booking systems handle seat reservations, payments, booking confirmations, refunds, asynchronous jobs, and email notifications.

---

# Features

## Authentication

* User Registration
* User Login
* JWT Authentication
* Password Hashing using bcrypt
* Role-based Authorization (Admin/User)

---

## Flight Management

* Add Flight
* Update Flight
* Delete Flight
* Search Flights

---

## Seat Management

* Automatic Seat Generation
* View Available Seats
* Reserve Multiple Seats
* Prevent Double Booking
* Seat Status Management

---

## Reservation System

* Temporary Seat Reservation
* Reservation Expiry
* Automatic Seat Release
* Redis-backed Reservation Locking

---

## Payment System

Integrated with **Razorpay**.

Features:

* Create Razorpay Order
* Payment Verification
* Signature Validation
* Transaction-safe Booking Creation
* Refund Initiation
* Refund Status Tracking

Payment Statuses:

* Pending
* Paid
* Failed
* Refund Initiated
* Refunded

---

## Booking System

* Booking Confirmation
* Passenger Management
* Booking Reference Generation
* Booking History
* Booking Status

---

## Email Notification System

Integrated with **Resend**.

Emails Supported:

* Welcome Email
* Booking Confirmation Email
* PDF Ticket Attachment

---

## PDF Ticket Generation

Every successful booking generates a professional flight ticket PDF containing:

* Passenger Details
* Flight Details
* Booking Reference
* Seat Numbers
* Payment Amount

The ticket is automatically attached to the booking confirmation email.

---

## Background Job Processing

Implemented using **BullMQ + Redis**.

Queues:

* Reservation Queue
* Email Queue
* Refund Queue

Workers:

* Reservation Worker
* Notification Worker
* Refund Worker

---

## Automatic Reservation Expiry

When seats are reserved:

* Expiry Job is scheduled
* If payment isn't completed before timeout:

  * Reservation is deleted
  * Seats become available automatically

---

## Refund Flow

If payment succeeds but booking creation fails:

1. Payment marked as **Refund Initiated**
2. Refund Job added to BullMQ
3. Refund Worker calls Razorpay Refund API
4. Payment updated to **Refunded**

This ensures payment consistency even during failures.

---

# Tech Stack

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Cache & Queue

* Redis
* BullMQ

## Authentication

* JWT
* bcrypt

## Payment Gateway

* Razorpay

## Email Service

* Resend

## PDF Generation

* PDFKit

## Validation

* express-validator

---

# Project Structure

```
backend/
│
├── config/
├── constants/
├── errorhandler/
├── features/
│   ├── Auth/
│   ├── booking/
│   ├── flight/
│   ├── payment/
│   ├── reservation/
│   ├── seat/
│   └── user/
│
├── handlers/
├── middleware.js/
├── queues/
├── workers/
├── services/
├── utils/
├── server.js
└── package.json
```

---

# Architecture

```
Client
   │
   ▼
Express API
   │
   ▼
Business Services
   │
   ├── MongoDB
   ├── Redis
   ├── Razorpay
   ├── BullMQ
   └── Resend
```

---

# Booking Flow

```
Search Flights
      │
      ▼
Reserve Seats
      │
      ▼
Reservation Created
      │
      ▼
Reservation Expiry Job Added
      │
      ▼
Create Razorpay Order
      │
      ▼
Payment Success
      │
      ▼
Verify Signature
      │
      ▼
Create Booking
      │
      ▼
Generate Ticket PDF
      │
      ▼
Booking Confirmation Email
      │
      ▼
Remove Reservation Expiry Job
```

---

# Refund Flow

```
Payment Success
      │
      ▼
Booking Creation Failed
      │
      ▼
Payment → Refund Initiated
      │
      ▼
Refund Queue
      │
      ▼
Refund Worker
      │
      ▼
Razorpay Refund API
      │
      ▼
Payment → Refunded
```

---

# Environment Variables

```
PORT=

MONGO_URI=

JWT_SECRET=

REDIS_HOST=
REDIS_PORT=

RAZORPAY_KEY_ID=
RAZORPAY_SECRET=

RESEND_API_KEY=

EMAIL_FROM=
```

---

# Installation

Clone the repository

```bash
git clone <repository-url>
```

Move into backend

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create `.env`

```bash
cp .env.example .env
```

Start Redis

```bash
docker run -p 6379:6379 redis
```

Run the server

```bash
npm run dev
```

Run workers

```bash
node workers/reservation.worker.js

node workers/notification.worker.js

node workers/refund.worker.js
```

LIVE DEMO URL

Backend:- https://flight-booking-applicaton.onrender.com

---

# Future Improvements

* Flight Cancellation
* Booking Cancellation
* Flight Rescheduling
* Admin Dashboard
* Scheduled Reminder Emails
* QR Code on Ticket
* Multi-Currency Payments
* Docker Compose
* CI/CD Pipeline
* Kubernetes Deployment
* Monitoring & Logging

---

# Author

**Arif Waquar**

Backend Developer | MERN Stack | Node.js | Express.js | MongoDB | Redis | BullMQ | Razorpay
