# MOPRA Backend

Express + MongoDB backend for the MOPRA website ticket system: "Reserve your spot" reservations, payment confirmation, and raffle ticket delivery (digital or in-person).

## Features

- **Reserve a spot:** `POST /api/tickets/reserve` saves a reservation (name, contact, quantity, message) into MongoDB with status `pending`.
- **Confirm payment:** `PATCH /api/tickets/:id/payment` records the payment (Zelle / Cash App / bank transfer / card) and a payment reference, then issues a raffle ticket number (e.g. `MOPRA-AB12CD34`) and moves the reservation to status `paid`.
- **Deliver the ticket:**
  - `PATCH /api/tickets/:id/delivery` with `{ "deliveryMethod": "digital" | "in-person" }`.
  - `digital` sends the ticket by email (ticket number + QR code).
  - `in-person` marks the ticket for in-person handoff at the meeting.
- **Resend:** `POST /api/tickets/:id/resend` re-sends the digital ticket email.

Reservation statuses: `pending` → `paid` → `delivered` (plus `cancelled` / `refunded`).

## Run locally

From the `backend` directory:

```bash
npm install
cp .env.example .env
# Edit .env and set your MongoDB connection string

npm run dev
```

The API runs on `http://localhost:5050` and a health check is at `http://localhost:5050/api/health`.

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | Backend port | `5050` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/mopra` |
| `CLIENT_URL` | Frontend origin allowed by CORS | `http://localhost:5173` |
| `APP_URL` | Public app URL used in ticket emails | `http://localhost:5173` |
| `TICKET_PRICE_USD` | Ticket price used in ticket payloads | `100` |
| `RAFFLE_CAPACITY` | Optional max tickets (reservations + paid). Set to `0` to disable. | `200` |
| `SMTP_HOST` | SMTP host for digital ticket email. Leave empty to skip sending. | - |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` / `SMTP_PASS` | SMTP credentials | - |
| `EMAIL_FROM` | From address for tickets | `no-reply@mopra.org` |

## API reference

### Create reservation

`POST /api/tickets/reserve`

```json
{
  "firstName": "Marie",
  "lastName": "Jean",
  "contact": "marie@example.com",
  "quantity": 1,
  "message": "Optional note",
  "paymentMethod": "zelle"
}
```

Response: `201` with `{ "reservation": {...}, "message": "..." }`.

### List reservations

`GET /api/tickets?status=pending`

### Get one reservation

`GET /api/tickets/:id`

### Confirm payment and issue ticket

`PATCH /api/tickets/:id/payment`

```json
{
  "paymentMethod": "zelle",
  "paymentReference": "Zelle transfer from Marie Jean - Nov 2"
}
```

Response: `200` with `{ "reservation": {...}, "ticket": { ticketNumber, qrDataUrl, ... } }`.

### Mark delivery

`PATCH /api/tickets/:id/delivery`

```json
{
  "deliveryMethod": "digital"
}
```

Response: `200` with `{ "reservation": {...}, "ticket": {...}, "email": {...} }`.

### Resend digital ticket

`POST /api/tickets/:id/resend`

```json
{ }
```

## Deploy to Render

The backend is deployed as a **Web Service** on Render.

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

Environment variables to set on the backend service:

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/mopra`) |
| `CLIENT_URL` | `https://mopra-frontend.onrender.com` (CORS allowlist for the frontend) |
| `PORT` | leave as default (Render assigns) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | for digital ticket emails |
| `TICKET_PRICE_USD`, `RAFFLE_CAPACITY` | optional |

## Workflow summary

1. Visitor reserves a spot → reservation saved as `pending`.
2. Visitor pays via Zelle / Cash App / bank transfer.
3. Staff confirms payment via `PATCH /api/tickets/:id/payment` → ticket number issued, status `paid`.
4. Staff sends ticket: `digital` (email with QR code) or `in-person` (handoff).
5. If email fails, staff can retry with `POST /api/tickets/:id/resend`.
