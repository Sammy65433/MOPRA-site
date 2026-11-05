# MOPRA Backend

Express + MongoDB backend for the MOPRA website ticket system: "Reserve your spot" reservations, payment confirmation, and raffle ticket delivery (digital or in-person).

## Features

- **Reserve a spot:** `POST /api/tickets/reserve` saves a reservation (name, contact, quantity, message) into MongoDB with status `pending`. Max 5 tickets per person; no duplicate reservations by name or contact.
- **Confirm payment:** `PATCH /api/tickets/:id/payment` records the payment and a payment reference, then issues raffle ticket numbers (one per quantity) and moves the reservation to status `paid`.
- **Deliver the ticket:**
  - `PATCH /api/tickets/:id/delivery` with `{ "deliveryMethod": "digital" | "in-person" }`.
  - `digital` sends the ticket by email (ticket number + QR code) via SendGrid HTTP API.
  - `in-person` marks the ticket for in-person handoff at the meeting.
- **Resend:** `POST /api/tickets/:id/resend` re-sends the digital ticket email.
- **Admin (password-protected):**
  - `GET /api/admin/tickets` lists confirmed (paid/delivered) purchases with ticket numbers.
  - `PATCH /api/admin/tickets/:id/cancel` marks a reservation as cancelled.
  - `DELETE /api/admin/tickets/:id` permanently removes a reservation.
  - `PATCH /api/admin/winner` sets the raffle winner (shown on the public site).
- **Public stats:** `GET /api/stats` returns participant count, tickets sold, and winner.

Reservation statuses: `pending` → `paid` → `delivered` (plus `cancelled`).

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
| `SENDGRID_API_KEY` | SendGrid API key for email delivery (HTTP API). Preferred on Render. | - |
| `ORGANIZER_EMAIL` | Staff notification recipients (comma-separated). | `info@gomopra.org, Cahctca@gmail.com` |
| `SMTP_HOST` | SMTP host (local dev fallback only; Render blocks SMTP ports). | - |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` / `SMTP_PASS` | SMTP credentials | - |
| `ADMIN_PASSWORD` | Staff admin password for `/api/admin` endpoints and the `/admin` page. (`ADMIN_TOKEN` still accepted as fallback.) | - |

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
  "paymentMethod": "clover"
}
```

Response: `201` with `{ "reservation": {...}, "emailNotification": {...}, "message": "..." }`.

Rules: quantity must be between 1 and 5. Duplicate reservations by name or contact (email/phone) are rejected with `409`.

### List reservations

`GET /api/tickets?status=pending`

### Get one reservation

`GET /api/tickets/:id`

### Confirm payment and issue ticket

`PATCH /api/tickets/:id/payment`

```json
{
  "paymentMethod": "clover",
  "paymentReference": "Clover checkout receipt for Marie Jean - Nov 2"
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
2. Visitor pays through the Clover checkout linked on the website.
3. Staff confirms payment via `PATCH /api/tickets/:id/payment` → ticket number issued, status `paid`.
4. Staff sends ticket: `digital` (email with QR code) or `in-person` (handoff).
5. If email fails, staff can retry with `POST /api/tickets/:id/resend`.



