# MOPRA Website

A responsive, multilingual website prototype for a developing nonprofit initiative connected to Haiti. Built to give the client a working preview of the design, organization story, raffle, and proposed ticket experience.

> **Project status:** Meeting preview. The organization's final website name, vision, story, raffle terms, ticket process, and payment details require client confirmation before launch.

## What the prototype includes

- **Home:** Animated hero, rotating photo gallery, interactive demo countdown, and Tickets section.
- **Our Story (`/about`):** Introductory copy and an illustrative photo. The organization's official vision and founding story are pending.
- **The Raffle (`/prizes`):** Prize-card layout with placeholder prize information. Images are for demonstration, not confirmation of prizes.
- **Tickets (`/#tickets`):** Six-image gallery, proposed payment-information layout, and reservation-form preview. The form **does not send or save submissions**.
- **Navigation:** Desktop links, a mobile dropdown, and a clickable logo that returns home.
- **Languages:** English, French, and Haitian Creole, with a language preference saved in the browser.
- **Accessibility considerations:** Semantic sections, labeled form fields, keyboard-focus styles, and reduced-motion support for animations.

## Important preview-only information

- The countdown runs for demonstration. It **does not** count down to an official drawing date.
- The displayed **$100 price, Zelle account, Cash App account, and bank-transfer option are unverified**. Do not send payment based on this prototype.
- Prize names, draw count, rules, eligibility, and ticket-delivery method are not finalized.
- Gallery photos are illustrative and should not be presented as photos of MOPRA activities without verification.
- The contact email currently displayed is `Cahctca@gmail.com`; confirm its spelling and ownership with the client.
- The website currently uses the name **MOPRA**, but the final website and organization naming should be confirmed with the client.

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
