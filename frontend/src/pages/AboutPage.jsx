import About from "../components/About";
import LasileMap from "../components/LasileMap";
import RaffleMarquee from "../components/RaffleMarquee";
import Tickets from "../Tickets";
import "./AboutPage.css";

export default function AboutPage({ t, language }) {
  return (
    <main id="top" className="pt-20">
      <About t={t} full />
      <RaffleMarquee language={language} />
      <Tickets t={t} />
      <section className="lasile-map-section">
        <LasileMap t={t} />
      </section>
    </main>
  );
}
