import Prizes from "../components/Prizes";

export default function PrizesPage({ t }) {
  return (
    <main id="top" className="px-5 pt-32 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <img
          src="/haitian-gallery1.jpg"
          alt="Illustrative community photograph"
          className="h-64 w-full rounded-2xl object-cover sm:h-96"
        />
      </div>
      <Prizes t={t} />
    </main>
  );
}
