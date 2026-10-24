import About from "../components/About";
import LasileMap from "../components/LasileMap";
import RaffleMarquee from "../components/RaffleMarquee";
import "./AboutPage.css";

export default function AboutPage({ t, language }) {
  return (
    <main id="top" className="pt-20">
      <About t={t} />

      <section className="lasile-map-section">
        <LasileMap t={t} />

      </section>

      <RaffleMarquee language={language} />
    </main>
  );
}
