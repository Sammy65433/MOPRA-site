# MOPRA Website

A responsive, multilingual React website prototype for a developing nonprofit initiative focused on L’Asile, Haiti. It gives the client a working preview of the organization’s story, raffle, ticket experience, and visual direction.

> **Status:** Client preview, not a live ticket sale. The organization’s official name, mission, raffle details, payment accounts, and ticket process still need confirmation.

## Pages and features

- **Home (`/`):** Animated welcome hero, MOPRA logo, rotating L’Asile image gallery, left-scrolling ticker, demo raffle countdown, and a Tickets section.
- **Our Story (`/about`):** Introductory organization copy, illustrative photography, and a seven-image L’Asile map gallery. Visitors can click a map image to enlarge it.
- **The Raffle (`/prizes`):** Responsive prize-card layout with example imagery and placeholder prize descriptions.
- **Tickets (`/tickets`):** Dedicated page with a photo-backed banner, demo countdown, six-image gallery, proposed payment layout, and reservation-form preview. The Tickets section also appears on Home.
- **Navigation:** Desktop navigation with icons, a mobile dropdown, language controls, and a clickable logo that returns to Home.
- **Languages:** English, French, and Haitian Creole. The selected language is saved in the browser.
- **Motion and accessibility:** Scroll reveals, photo transitions, labeled form fields, keyboard-focus styles, and reduced-motion support.

## Technology

- React and Vite
- React Router
- Tailwind CSS and component-specific CSS
- Framer Motion
- Lucide React

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
```

## Deployment

The frontend is deployed on Render as a **Static Site**. Its build settings are:

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`

React Router paths such as `/about`, `/prizes`, and `/tickets` need a rewrite from `/*` to `/index.html` so direct visits and refreshes work.

## Project structure

```text
MOPRA-Website/
├── frontend/
│   ├── public/              # Logo, photos, prize images, and map images
│   └── src/
│       ├── components/      # Header, Hero, About, Prizes, Footer, map gallery
│       ├── pages/           # About, raffle, and Tickets page wrappers
│       ├── App.jsx          # Routes and homepage assembly
│       ├── Countdown.jsx    # Demo timer and rotating image
│       ├── Tickets.jsx      # Ticket layout and non-sending form
│       └── i18n.js          # English, French, and Haitian Creole copy
└── README.md
```

## Preview-only details

- The countdown restarts as a **120-day demo** when the component loads. It does **not** show the official drawing date.
- The displayed **$100 ticket price**, Zelle account, Cash App account, and bank-transfer option have **not been verified**. Do not send payment based on this preview.
- The reservation form **does not send or save submissions**. Visitors should not enter real personal information.
- The displayed prize images are examples, not confirmed prizes. The current layout has **five demo cards**, while some translation arrays contain only four placeholder entries.
- Gallery photos need review before being described as images of the organization’s activities.
- The map gallery uses Google map imagery. Check usage rights and preserve required attribution before public use.
- The displayed contact email is `Cahctca@gmail.com`. Confirm its spelling and ownership.
- Confirm the exact spelling of **“Mouvement Patriotique pour la Renaissance de L’Asile”**, the approved website name, and the organization’s official story.

## Before launch

1. Approve the organization name, mission, story, and all three language versions.
2. Confirm the raffle prizes, number of draws, drawing date, eligibility, and official rules.
3. Verify ticket pricing, payment accounts, and physical or digital ticket delivery.
4. Connect the form to an approved submission destination and test the full workflow.
5. Review photo permissions, map attribution, accessibility, and mobile performance.
6. Replace all meeting-preview notices and placeholder content only after details are approved.
