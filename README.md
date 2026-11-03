# MOPRA Website

A responsive, multilingual React website for the Mouvement Patriotique pour la Renaissance de L’Asile (MOPRA), focused on L’Asile, Haiti, its community story, and the Grand Raffle for the 3rd Centenary of L’Asile.

> **Status:** The raffle date, prizes, official flyer, and $100.00 USD ticket price are published on the site. The official MOPRA QR code and a clickable payment button open the online checkout. Reservations remain pending until the organizers confirm payment.

## Pages and features

- **Home (`/`):** Animated community hero with links to Our Story, Raffle/Prizes, and Tickets; raffle ticker; countdown to December 31, 2027; official raffle flyer and rules; ticket payment and reservation; and L’Asile map gallery. Full story and prize cards are not duplicated on this page.
- **Our Story (`/about`):** An expanded MOPRA community narrative in all three site languages, community values, official raffle details, and an interactive seven-image L’Asile map gallery.
- **The Raffle (`/prizes`):** Grand Raffle introduction, real-date countdown, official flyer, drawing information, prize rules, four illustrated prize cards, and a dedicated cash-alternative section with a currency photo.
- **Tickets (`/tickets`):** Official raffle information, confirmed $100.00 USD ticket price, official MOPRA payment QR code, clickable online payment button, six-image gallery, and reservation form.
- **Navigation:** Desktop navigation with icons, a mobile dropdown, language controls, and a clickable logo that returns to Home.
- **Languages:** English, French, and Haitian Creole. The selected language is saved in the browser.
- **Motion and accessibility:** Scroll reveals, photo transitions, labeled form fields, keyboard-focus styles, image descriptions, and reduced-motion support.

## Confirmed raffle content

- **Drawing:** December 31, 2027, in L’Asile and via Zoom. The drawing time and Zoom access details have not been supplied.
- **Ticket price:** **$100.00 USD** each.
- **Main payment method:** The official `frontend/public/MOPRA-QR-CODE.png` image. Clients can scan it or click it to open the organizer-supplied [online payment page](https://link.clover.com/urlshortener/CVF3dD); a separate clickable payment button uses the same URL.
- **1st prize:** One 2026 Jeep Wrangler or **$60,000**.
- **2nd prize:** One complete 10 kW solar system with lithium battery or **$10,000**.
- **3rd prize:** One Toro 200 motorcycle or **$2,500**.
- **4th prize:** One Boxer 125 motorcycle or **$1,500**.
- Prizes are awarded in U.S. currency and in the United States. Winners are responsible for taxes and shipping accommodations.

The countdown targets the local start of December 31, 2027, because an exact drawing time and time zone have not been provided.

## Technology

- React and Vite
- React Router
- Tailwind CSS and component-specific CSS
- Framer Motion
- Lucide React

## Backend

The ticket reservation and raffle ticket flow is backed by an Express + MongoDB API in `backend/`:

- `POST /api/tickets/reserve` saves a reservation to MongoDB with `pending` status.
- `PATCH /api/tickets/:id/payment` confirms payment and issues a raffle ticket number when payment is received.
- `PATCH /api/tickets/:id/delivery` selects digital or in-person delivery after payment.
- `POST /api/tickets/:id/resend` resends the digital ticket email.

See `backend/README.md` for setup and full API details.

During local development, Vite proxies `/api` to `http://localhost:5050`. For production, set `VITE_API_URL` to the backend URL before building.

## Run locally

From the `frontend` directory:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

To test the production build:

```bash
npm run build
npm run lint
```

## Deployment

The frontend is deployed on Render as a **Static Site**:

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`

React Router paths such as `/about`, `/prizes`, and `/tickets` need a rewrite from `/*` to `/index.html` so direct visits and refreshes work.

## Project structure

```text
MOPRA-Website/
├── frontend/
│   ├── public/              # Logo, official flyer, prize photos, and galleries
│   └── src/
│       ├── components/      # Header, Hero, About, Prizes, RaffleDetails, Footer
│       ├── pages/           # About, raffle, and Tickets page wrappers
│       ├── App.jsx          # Routes and homepage assembly
│       ├── Countdown.jsx    # December 31, 2027 drawing countdown
│       ├── Tickets.jsx      # Clover payment/QR code and reservation form
│       └── i18n.js          # English, French, and Haitian Creole copy
├── backend/                 # Express + MongoDB ticket API
└── README.md
```

## Details still requiring review before launch

- Test the Clover checkout and confirm that its account, payment descriptions, and receipts match the intended raffle and donation workflow.
- Reservations use the MongoDB backend when the API is running and remain `pending` until payment is confirmed. The Clover payment and reservation systems are not automatically synchronized.
- Prize photographs are illustrative; final prize specifications and official raffle rules should be reviewed before publication.
- The expanded MOPRA story is drafted website copy and should be reviewed by the organization.
- Gallery photos need review before being described as documented organization activities.
- Google map imagery requires appropriate attribution and usage-rights review.
- Confirm ownership of the displayed contact email, `Cahctca@gmail.com`.
- Confirm the drawing time, time zone, Zoom access process, eligibility, and complete official rules.
