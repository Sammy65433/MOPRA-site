import { Link } from "react-router-dom";

export default function Footer({ t }) {
  const email = "Cahctca@gmail.com";

  return (
    <footer className="border-t border-white/10 px-5 py-8 text-sm text-white/70 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
        <Link
          to="/"
          aria-label="MOPRA home"
          className="inline-flex items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b7ff]"
        >
          <img
            src="/MOPRA-logo.png"
            alt=""
            className="h-12 w-12 object-contain"
          />
          <span className="font-display font-bold tracking-[0.25em] text-white">
            MOPRA
          </span>
        </Link>

        <div className="flex flex-col gap-2">
          <span>{t.footer}</span>
          <a
            href={`mailto:${email}`}
            className="w-fit text-[#a6d0ff] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#79b7ff]"
          >
            {email}
          </a>
        </div>

        <span>© {new Date().getFullYear()}</span>
      </div>

      <p className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-center text-sm text-white/60">
        Community at heart. Haiti in our future.
      </p>
    </footer>
  );
}
