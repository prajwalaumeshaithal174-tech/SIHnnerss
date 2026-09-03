import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";

type Language = {
  code: string;
  native: string;
  roman: string;
  dir?: "rtl";
};

/** v1 — language selection. Supported languages, all major Indian scripts + English. */
const LANGUAGES: Language[] = [
  { code: "en", native: "English", roman: "English" },
  { code: "hi", native: "हिन्दी", roman: "Hindi" },
  { code: "mr", native: "मराठी", roman: "Marathi" },
  { code: "bn", native: "বাংলা", roman: "Bengali" },
  { code: "ta", native: "தமிழ்", roman: "Tamil" },
  { code: "te", native: "తెలుగు", roman: "Telugu" },
  { code: "kn", native: "ಕನ್ನಡ", roman: "Kannada" },
  { code: "ml", native: "മലയാളം", roman: "Malayalam" },
  { code: "gu", native: "ગુજરાતી", roman: "Gujarati" },
  { code: "or", native: "ଓଡ଼ିଆ", roman: "Odia" },
  { code: "pa", native: "ਪੰਜਾਬੀ", roman: "Punjabi" },
  { code: "ur", native: "اردو", roman: "Urdu", dir: "rtl" },
];

/** Signature easing — slow-out editorial glide. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const BLUR_IN = (blur: number) => ({ filter: `blur(${blur}px)` });

export default function Landing() {
  const prefersReducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const selectedLanguage = LANGUAGES.find((lang) => lang.code === selected);

  const headlineWords = ["Choose", "your", "language"];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Thin editorial frame around the viewport */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-2 z-0 rounded-[3px] border border-foreground/10 sm:inset-3"
      />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-5 py-16 sm:px-8 sm:py-24">
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
          className="flex items-center gap-3"
        >
          <span aria-hidden="true" className="h-2 w-2 bg-[#4f6d7a]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-foreground sm:text-xs">
            Hyper
          </span>
          <span aria-hidden="true" className="h-px w-6 bg-border" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:text-[11px]">
            AI Assistant
          </span>
        </motion.div>

        {/* Headline — word-by-word blur-to-sharp reveal */}
        <h1 className="mt-9 flex max-w-3xl flex-wrap items-baseline justify-center gap-x-[0.26em] text-center font-display text-4xl font-bold leading-[1.08] tracking-[-0.02em] sm:mt-10 sm:text-5xl lg:text-6xl">
          {headlineWords.map((word, index) => (
            <motion.span
              key={word}
              initial={{
                opacity: 0,
                y: prefersReducedMotion ? 0 : 22,
                ...(prefersReducedMotion ? {} : BLUR_IN(10)),
              }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                ease: EASE,
                delay: 0.12 + index * 0.09,
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Sub copy */}
        <motion.p
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
          className="mt-5 max-w-xl text-center text-sm leading-relaxed text-muted-foreground sm:text-[15px]"
        >
          Everything Hyper builds for you — your business plan, feasibility
          read and financial numbers — begins in the language you know best.
        </motion.p>

        {/* Catalogue caption above the grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.58 }}
          className="mt-14 flex w-full max-w-[58rem] items-center gap-4 sm:mt-16"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground sm:text-[11px]">
            Languages
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-foreground/10" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
            {String(LANGUAGES.length).padStart(2, "0")} available
          </span>
        </motion.div>

        {/* Language plates — slide in from alternating sides, blur-to-sharp */}
        <div
          role="group"
          aria-label="Supported languages"
          className="mt-6 grid w-full max-w-[58rem] grid-cols-2 gap-2.5 sm:mt-7 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-4"
        >
          {LANGUAGES.map((lang, index) => {
            const fromLeft = index % 2 === 0;
            const isSelected = selected === lang.code;
            return (
              <motion.button
                key={lang.code}
                type="button"
                aria-pressed={isSelected}
                aria-label={lang.native}
                initial={{
                  opacity: 0,
                  x: prefersReducedMotion ? 0 : fromLeft ? 56 : -56,
                  ...(prefersReducedMotion ? {} : BLUR_IN(12)),
                }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.8,
                  ease: EASE,
                  delay: 0.62 + index * 0.05,
                }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                onClick={() => setSelected(lang.code)}
                className={
                  "group relative flex min-h-[92px] w-full flex-col items-center justify-center gap-1.5 rounded-md border px-3 py-5 text-center outline-none transition-[border-color,background-color,color,box-shadow] duration-300 ease-out sm:min-h-[116px] focus-visible:ring-2 focus-visible:ring-[#4f6d7a]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
                  (isSelected
                    ? "border-[#4f6d7a] bg-[#4f6d7a]/[0.07] shadow-[0_12px_30px_-16px_rgba(79,109,122,0.55)]"
                    : "border-foreground/15 bg-[#f8f6ef]/70 hover:border-[#4f6d7a]/70 hover:bg-[#fbf9f3] hover:shadow-[0_16px_38px_-16px_rgba(79,109,122,0.42)]")
                }
              >
                {/* Plate index */}
                <span
                  aria-hidden="true"
                  className={
                    "absolute left-3 top-2.5 text-[9px] font-medium tracking-[0.18em] tabular-nums sm:text-[10px] " +
                    (isSelected ? "text-[#4f6d7a]" : "text-muted-foreground/80")
                  }
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Selection badge */}
                {isSelected && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    aria-hidden="true"
                    className="absolute right-2.5 top-2.5 grid size-4 place-items-center rounded-full bg-[#4f6d7a] text-white sm:size-[18px]"
                  >
                    <Check className="size-2.5" strokeWidth={3} />
                  </motion.span>
                )}

                <span
                  dir={lang.dir}
                  className="font-display text-lg font-semibold leading-snug tracking-[-0.01em] sm:text-xl lg:text-[22px]"
                >
                  {lang.native}
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground/90 sm:text-[10px]">
                  {lang.roman}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Status microline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.95 + LANGUAGES.length * 0.02 }}
          className="mt-12 flex w-full max-w-[58rem] items-center justify-between gap-6 border-t border-foreground/10 pt-4 text-[9px] uppercase tracking-[0.22em] text-muted-foreground sm:mt-14 sm:text-[10px]"
        >
          <span aria-hidden="true" className="hidden sm:inline">
            Hyper · Demo build — V1
          </span>
          <span aria-hidden="true" className="sm:hidden">
            Hyper
          </span>
          <span role="status" aria-live="polite" className="text-right">
            {selectedLanguage
              ? `Selected — ${selectedLanguage.roman}`
              : "Select a language to continue"}
          </span>
        </motion.div>
      </main>
    </div>
  );
}
