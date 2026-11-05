import { ListOrdered } from "lucide-react";

export default function HowItWorks({ t, compact = false }) {
  const steps = t?.howItWorksSteps || [];
  const title = t?.howItWorksTitle || "How to reserve your spot";
  const note = t?.howItWorksNote;
  const short = t?.howItWorksShort;

  if (compact) {
    return (
      <p className="text-center text-sm leading-6 text-white/80 sm:text-base">
        {short}
      </p>
    );
  }

  return (
    <section className="mx-5 my-8 sm:mx-8" aria-labelledby="how-it-works-title">
      <div className="mx-auto max-w-4xl rounded-3xl border border-[#e5c77e]/40 bg-[#0f172a]/70 p-6 shadow-lg sm:p-8">
        <h3
          id="how-it-works-title"
          className="flex items-center gap-2 text-xl font-bold text-[#f7df9f] sm:text-2xl"
        >
          <ListOrdered size={22} aria-hidden="true" />
          {title}
        </h3>
        <ol className="mt-5 space-y-3">
          {steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm leading-7 text-white/90 sm:text-base">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e5c77e] text-sm font-extrabold text-[#0f172a]">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        {note && (
          <p className="mt-4 text-xs leading-6 text-white/60 sm:text-sm">{note}</p>
        )}
      </div>
    </section>
  );
}
