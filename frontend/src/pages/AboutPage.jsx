import About from "../components/About";
import LasileMap from "../components/LasileMap";

export default function AboutPage({ t }) {
  return (
    <main id="top" className="pt-20">
      <About t={t} />
      <LasileMap />
    </main>
  );
}
