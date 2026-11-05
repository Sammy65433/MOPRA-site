import {
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  Gift,
  HeartHandshake,
  House,
  Mail,
  QrCode,
  Sparkles,
  Ticket,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";

const CLOVER_URL = "https://www.clover.com/pay-widgets/b31dc9e4-f7f7-466d-b851-557bb96dfbd9";
const CURRENT_YEAR = 2026;

export default function Footer({ t }) {
  const email = "Cahctca@gmail.com";
  const copy = t.ticketPage ?? {};

  return (
    <footer className="site-footer">
      <div className="site-footer__glow site-footer__glow--one" aria-hidden="true" />
      <div className="site-footer__glow site-footer__glow--two" aria-hidden="true" />

      <div className="site-footer__inner">
        <div className="site-footer__cta-card">
          <div className="site-footer__cta-copy">
            <p className="site-footer__cta-badge">
              <Sparkles size={18} aria-hidden="true" />
              <span>{t.raffleTag ?? "THE GRAND RAFFLE · 3RD CENTENARY OF L’ASILE"}</span>
            </p>
            <h3>{copy.price ?? "Raffle ticket · $100 USD"}</h3>
            <p>
              {t.dateNote ??
                "Drawing December 31, 2027 in L’Asile and via Zoom · Tickets: $100 USD each."}
            </p>
          </div>

          <div className="site-footer__cta-actions">
            <a
              href={CLOVER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__btn site-footer__btn--pay"
            >
              <QrCode size={22} aria-hidden="true" />
              <span>{copy.paymentButton ?? "Pay Online · $100 USD"}</span>
              <ExternalLink size={18} aria-hidden="true" />
            </a>

            <a
              href="#reserve-spot"
              className="site-footer__btn site-footer__btn--reserve"
            >
              <Ticket size={22} aria-hidden="true" />
              <span>{t.prizeReserveCta ?? "Reserve your spot · $100"}</span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="site-footer__main">
          <div className="site-footer__brand">
            <Link to="/" aria-label="MOPRA home" className="site-footer__logo-link">
              <img
                src="/MOPRA-logo.png"
                alt=""
                className="h-20 w-20 object-contain sm:h-24 sm:w-24"
              />
              <div>
                <span className="site-footer__brand-name">MOPRA</span>
                <p className="site-footer__brand-full">
                  {t.organizationFullName ??
                    "Mouvement Patriotique pour la Renaissance de L’Asile"}
                </p>
              </div>
            </Link>
            <p className="site-footer__tagline">{t.footer}</p>
          </div>

          <nav className="site-footer__nav" aria-label="Footer navigation">
            <Link to="/" className="site-footer__nav-link">
              <House size={19} aria-hidden="true" />
              {t.navHome}
            </Link>
            <Link to="/about" className="site-footer__nav-link">
              <BookOpen size={19} aria-hidden="true" />
              {t.navAbout}
            </Link>
            <Link to="/prizes" className="site-footer__nav-link">
              <Gift size={19} aria-hidden="true" />
              {t.navPrizes}
            </Link>
            <Link to="/tickets" className="site-footer__nav-link">
              <Ticket size={19} aria-hidden="true" />
              {t.navTickets}
            </Link>
          </nav>

          <div className="site-footer__contact">
            <span className="site-footer__contact-label">
              {copy.questions ?? "Questions? Email"}
            </span>
            <a href={`mailto:${email}`} className="site-footer__email">
              <Mail size={22} aria-hidden="true" />
              <span>{email}</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <span className="site-footer__copyright">
              © {CURRENT_YEAR} MOPRA · L’Asile, Haiti
            </span>
          </div>
        </div>

        <p className="site-footer__slogan">
          <HeartHandshake size={22} aria-hidden="true" />
          <span>{t.footerSlogan ?? "Community at heart. Haiti in our future."}</span>
        </p>
      </div>
    </footer>
  );
}
