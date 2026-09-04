import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Uppercase micro-label with wide tracking — the editorial caption voice. */
export function Micro({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-[9px] font-medium uppercase tracking-[0.24em] text-muted-foreground sm:text-[10px]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Word-by-word blur-to-sharp text reveal. */
export function Reveal({
  text,
  delay = 0,
  wordDelay = 0.018,
  className,
}: {
  text: string;
  delay?: number;
  wordDelay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={cn("inline", className)} aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="inline-block whitespace-pre"
          initial={{
            opacity: 0,
            y: reduced ? 0 : 8,
            ...(reduced ? {} : { filter: "blur(6px)" }),
          }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.45,
            ease: EASE,
            delay: delay + index * wordDelay,
          }}
        >
          {index < words.length - 1 ? `${word} ` : word}
        </motion.span>
      ))}
    </span>
  );
}

/** Framed studio panel — thin border, ivory paper, soft drop shadow. */
export function Panel({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-md border border-foreground/12 bg-card/85 shadow-[0_36px_90px_-56px_rgba(31,41,51,0.5)]",
        className,
      )}
      {...rest}
    >
      {children}
    </article>
  );
}

/** Panel header — catalogue tag + title + optional trailing element. */
export function PanelHeader({
  tag,
  title,
  hint,
  trailing,
}: {
  tag: string;
  title: string;
  hint?: string;
  trailing?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-foreground/10 px-6 pb-5 pt-6 sm:px-7 sm:pt-7">
      <div>
        <Micro className="text-[#4f6d7a]">{tag}</Micro>
        <h2 className="mt-1.5 font-display text-xl font-bold tracking-[-0.015em] sm:text-2xl">
          {title}
        </h2>
        {hint && (
          <p className="mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
            {hint}
          </p>
        )}
      </div>
      {trailing}
    </header>
  );
}

/** Hairline-divided section inside a panel. */
export function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border-b border-foreground/10 px-6 py-6 last:border-b-0 sm:px-7",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground sm:text-[11px]">
      {children}
    </h3>
  );
}

export type Tone = "high" | "moderate" | "conditional";

const TONE_TEXT: Record<Tone, string> = {
  high: "text-[#3c5a66]",
  moderate: "text-[#6b7884]",
  conditional: "text-[#9a7a45]",
};

const TONE_DOT: Record<Tone, string> = {
  high: "bg-[#4f6d7a]",
  moderate: "bg-[#8a97a0]",
  conditional: "bg-[#b08d57]",
};

/** Small verdict chip used on the feasibility card. */
export function ToneChip({ tone, label }: { tone: Tone; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]",
        TONE_TEXT[tone],
      )}
    >
      <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", TONE_DOT[tone])} />
      {label}
    </span>
  );
}

/** Animated horizontal bar (grow effect). */
export function GrowBar({
  pct,
  delay = 0,
  className,
}: {
  pct: number;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-foreground/10", className)}>
      <motion.div
        initial={{ width: reduced ? `${pct}%` : "0%" }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: EASE, delay }}
        className="h-full rounded-full bg-[#4f6d7a]"
      />
    </div>
  );
}

/** Label + value hairline row used across both reports. */
export function StatRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-foreground/8 py-2.5 last:border-b-0">
      <div className="min-w-0">
        <span className="block text-[13px] leading-snug text-foreground/90">{label}</span>
        {sub && (
          <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
            {sub}
          </span>
        )}
      </div>
      <span className="shrink-0 text-right font-display text-[15px] font-semibold tracking-[-0.01em]">
        {value}
      </span>
    </div>
  );
}
