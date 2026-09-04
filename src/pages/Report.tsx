import { useMemo } from "react";
import { Navigate, useNavigate } from "react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RefreshCw } from "lucide-react";
import {
  GrowBar,
  Micro,
  Panel,
  PanelHeader,
  Reveal,
  Section,
  SectionLabel,
  StatRow,
  ToneChip,
  type Tone,
} from "@/components/studio-kit";
import {
  clearDraft,
  computeReport,
  inr,
  loadDraft,
  sectorLabel,
  type MonthlyPoint,
  type ReportData,
} from "@/lib/hyper";
import { isRtl, t } from "@/lib/locales";
import { languageByCode } from "@/lib/languages";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const STORM = "#4f6d7a";
const SLATE = "#8a97a0";

const monthLabel = (lang: string, m: number): string => {
  if (m === 0) return t(lang, "emi.today");
  if (m % 12 === 0) return t(lang, "emi.chartYr", { n: m / 12 });
  return t(lang, "emi.chartMo", { n: m });
};

/** Localized grade word, lowercased for mid-sentence use. */
const gradeLower = (lang: string, tone: string): string =>
  t(lang, `grades.${tone}` as never).toLowerCase();

/* ------------------------------------------------------------------ */
/* Chart tooltips                                                      */
/* ------------------------------------------------------------------ */

function RupeeTooltip({
  active,
  payload,
  label,
  lang,
}: {
  active?: boolean;
  payload?: { dataKey?: string | number; name?: string; value?: number | string; color?: string }[];
  label?: number | string;
  lang: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-md border border-foreground/15 bg-card px-3 py-2 shadow-lg">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {monthLabel(lang, Number(label))}
      </p>
      {payload.map((entry) => (
        <p
          key={String(entry.dataKey)}
          className="mt-1 text-xs font-medium text-foreground tabular-nums"
        >
          <span
            aria-hidden="true"
            className="mr-1.5 inline-block size-2 rounded-full"
            style={{ backgroundColor: entry.color ?? STORM }}
          />
          {String(entry.name ?? entry.dataKey)} · {inr(Number(entry.value))}
        </p>
      ))}
    </div>
  );
}

function FactorTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey?: string | number; value?: number | string }[];
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const note = (payload[0] as { payload?: { note?: string } })?.payload?.note;
  return (
    <div className="rounded-md border border-foreground/15 bg-card px-3 py-2 shadow-lg">
      <p className="text-[11px] font-semibold text-foreground">
        {String(label)} · {String(payload[0]?.value)}/100
      </p>
      {note && (
        <p className="mt-0.5 max-w-40 text-[11px] leading-snug text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Report A — Business Feasibility                                     */
/* ------------------------------------------------------------------ */

function FeasibilityCard({ data }: { data: ReportData }) {
  const lang = data.lang || "en";
  const f = data.feasibility;
  const tone = f.tone as Tone;
  const catLabel = sectorLabel(lang, data.category.code);

  const hint = t(lang, "f.hint", {
    category: catLabel.toLowerCase(),
    place: data.place,
    grade: gradeLower(lang, f.tone),
    factor1: f.factors[0].key,
    score1: f.factors[0].value,
    factor2: f.factors[1].key,
    score2: f.factors[1].value,
  });

  return (
    <Panel className="w-full" lang={lang}>
      <PanelHeader
        tag={t(lang, "report.aTag")}
        title={t(lang, "report.aTitle")}
        hint={hint}
        trailing={<ToneChip tone={tone} label={t(lang, `grades.${f.tone}` as never)} />}
      />

      {/* Market reach */}
      <Section>
        <SectionLabel>{t(lang, "f.market")}</SectionLabel>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-md border border-foreground/10 bg-background/50 p-3.5">
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t(lang, "f.statAddressable")}
            </p>
            <p className="mt-1.5 font-display text-lg font-bold tracking-[-0.01em] tabular-nums">
              {inr(f.addressableMonthly)}
            </p>
            <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
              {t(lang, "f.statAddressableSub")}
            </p>
          </div>
          <div className="rounded-md border border-foreground/10 bg-background/50 p-3.5">
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t(lang, "f.statShare")}
            </p>
            <p className="mt-1.5 font-display text-lg font-bold tracking-[-0.01em] tabular-nums">
              {f.capturePct}%
            </p>
            <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
              {t(lang, "f.statShareSub")}
            </p>
          </div>
          <div className="rounded-md border border-foreground/10 bg-background/50 p-3.5">
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t(lang, "f.statTurnover")}
            </p>
            <p className="mt-1.5 font-display text-lg font-bold tracking-[-0.01em] tabular-nums">
              {inr(f.capturedMonthly)}
            </p>
            <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
              {t(lang, "f.statTurnoverSub")}
            </p>
          </div>
          <div className="rounded-md border border-foreground/10 bg-background/50 p-3.5">
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t(lang, "f.statBreakeven")}
            </p>
            <p className="mt-1.5 font-display text-lg font-bold tracking-[-0.01em] tabular-nums">
              {inr(f.breakEvenSales)}
            </p>
            <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
              {t(lang, "f.statBreakevenSub", { cost: inr(f.fixedMonthly) })}
            </p>
          </div>
        </div>
      </Section>

      {/* Opportunity analysis */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionLabel>{t(lang, "f.oppTitle")}</SectionLabel>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
              {t(lang, "f.oppBody")}
            </p>
          </div>
          <p className="text-right">
            <span className="block font-display text-3xl font-bold tracking-[-0.02em] tabular-nums">
              {f.overall}
              <span className="text-base font-semibold text-muted-foreground">/100</span>
            </span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {t(lang, "f.score")}
            </span>
          </p>
        </div>
        <GrowBar pct={f.overall} delay={0.7} className="mt-3" />
        <div className="mt-6 h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={f.factors} margin={{ top: 18, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="rgba(31,41,51,0.07)" />
              <XAxis
                dataKey="key"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#5f6b76" }}
                interval={0}
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip cursor={{ fill: "rgba(79,109,122,0.08)" }} content={<FactorTooltip />} />
              <Bar dataKey="value" fill={STORM} radius={[4, 4, 2, 2]} maxBarSize={44} animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      {/* SWOT */}
      <Section>
        <SectionLabel>{t(lang, "f.swotTitle")}</SectionLabel>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <SwotBox tag="S" label={t(lang, "f.swotS")} tone={STORM} items={f.swot.s} />
          <SwotBox tag="W" label={t(lang, "f.swotW")} tone={SLATE} items={f.swot.w} />
          <SwotBox tag="O" label={t(lang, "f.swotO")} tone={STORM} items={f.swot.o} />
          <SwotBox tag="T" label={t(lang, "f.swotT")} tone="#b08d57" items={f.swot.t} />
        </div>
      </Section>

      {/* Competitor mapping */}
      <Section>
        <SectionLabel>{t(lang, "f.compTitle")}</SectionLabel>
        <div className="mt-3">
          {f.competitors.map((competitor, index) => (
            <div
              key={competitor.name}
              className="border-b border-foreground/8 py-4 last:border-b-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[14px] font-semibold leading-tight">
                  {competitor.name}
                </p>
                <Micro className="tabular-nums">{t(lang, "f.compShare", { share: competitor.share })}</Micro>
              </div>
              <GrowBar pct={competitor.share} delay={0.9 + index * 0.12} className="mt-2" />
              <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
                <p className="text-[11px] leading-snug text-muted-foreground">
                  <span className="text-foreground/80">{competitor.format}</span>
                </p>
                <p className="text-[11px] leading-snug text-muted-foreground">
                  {t(lang, "f.compPricing")} — {competitor.pricing}
                </p>
                <p className="text-[11px] leading-snug text-muted-foreground">
                  {t(lang, "f.compEdge")} — {competitor.edge}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section>
        <SectionLabel>{t(lang, "f.pricingTitle")}</SectionLabel>
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <span className="rounded-md border border-[#4f6d7a]/40 bg-[#4f6d7a]/[0.07] px-3 py-1.5 font-display text-sm font-bold tabular-nums text-[#3c5a66]">
            {inr(f.pricing.bandLow)}
          </span>
          <span className="text-xs text-muted-foreground">{t(lang, "f.rangeTo")}</span>
          <span className="rounded-md border border-[#4f6d7a]/40 bg-[#4f6d7a]/[0.07] px-3 py-1.5 font-display text-sm font-bold tabular-nums text-[#3c5a66]">
            {inr(f.pricing.bandHigh)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {t(lang, "f.pricingTicket", {
              category: catLabel.toLowerCase(),
              ticket: inr(f.pricing.ticket),
              low: f.pricing.marginLow,
              high: f.pricing.marginHigh,
            })}
          </span>
        </div>
        <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-foreground/85">
          {f.pricing.positioning}
        </p>
      </Section>
    </Panel>
  );
}

function SwotBox({
  tag,
  label,
  tone,
  items,
}: {
  tag: string;
  label: string;
  tone: string;
  items: string[];
}) {
  return (
    <div className="rounded-md border border-foreground/10 bg-background/45 p-4">
      <p className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="grid size-5 place-items-center rounded-[3px] text-[10px] font-bold text-white"
          style={{ backgroundColor: tone }}
        >
          {tag}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-xs leading-relaxed text-foreground/85">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Report B — Financial Calculator                                     */
/* ------------------------------------------------------------------ */

function FinancialCard({ data }: { data: ReportData }) {
  const lang = data.lang || "en";
  const fin = data.financial;
  const catLabel = sectorLabel(lang, data.category.code);

  return (
    <Panel className="w-full" lang={lang}>
      <PanelHeader
        tag={t(lang, "report.bTag")}
        title={t(lang, "report.bTitle")}
        hint={t(lang, "fin.hint")}
        trailing={
          <span className="rounded-full border border-foreground/15 bg-background/70 px-3.5 py-1.5 text-[11px] font-semibold text-foreground tabular-nums">
            {t(lang, "fin.deployChip", { value: inr(fin.deployable) })}
          </span>
        }
      />

      {/* Project cost */}
      <Section>
        <SectionLabel>{t(lang, "fin.headsTitle", { capital: inr(fin.capital) })}</SectionLabel>
        <div className="mt-4 space-y-4">
          {fin.heads.map((head, index) => (
            <div key={head.key}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[13px] font-medium">{head.key}</span>
                <span className="font-display text-sm font-semibold tabular-nums">
                  {inr(head.amount)}
                  <span className="ml-2 text-[11px] font-medium text-muted-foreground">
                    {head.pct}%
                  </span>
                </span>
              </div>
              <GrowBar pct={head.pct} delay={0.5 + index * 0.09} className="mt-2" />
            </div>
          ))}
        </div>
      </Section>

      {/* Loan eligibility */}
      <Section>
        <SectionLabel>{t(lang, "fin.loanTitle")}</SectionLabel>
        <div className="mt-3 space-y-0.5">
          <StatRow
            label={t(lang, "fin.rowEquity")}
            value={inr(fin.capital)}
            sub={t(lang, "fin.rowEquitySub")}
          />
          <StatRow
            label={t(lang, "fin.rowLine")}
            value={inr(fin.loan)}
            sub={t(lang, "fin.rowLineSub", {
              pct: Math.round((fin.loan / fin.project) * 100),
              rate: fin.ratePct,
            })}
          />
          <StatRow
            label={t(lang, "fin.rowProject")}
            value={inr(fin.deployable)}
            sub={t(lang, "fin.rowProjectSub")}
          />
        </div>
        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t(lang, "fin.docsTitle")}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {fin.docs.map((doc) => (
              <span
                key={doc}
                className="rounded-full border border-foreground/15 bg-background/60 px-3 py-1 text-[11px] text-foreground/80"
              >
                {doc}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* EMI schedule */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionLabel>{t(lang, "emi.title")}</SectionLabel>
            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
              {t(lang, "emi.body", {
                post: inr(fin.postEmi),
                mor: fin.moratoriumMonths,
                pre: inr(fin.preEmi),
              })}
            </p>
          </div>
          <p className="text-right">
            <span className="block font-display text-3xl font-bold tracking-[-0.02em] tabular-nums">
              {inr(fin.postEmi)}
            </span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {t(lang, "emi.monthly")}
            </span>
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5">
          <span className="inline-flex items-center gap-2 text-[11px] text-muted-foreground">
            <span aria-hidden="true" className="h-0.5 w-5 rounded-full bg-[#4f6d7a]" />
            {t(lang, "emi.legendOutstanding")}
          </span>
          <span className="inline-flex items-center gap-2 text-[11px] text-muted-foreground">
            <span aria-hidden="true" className="h-0 w-5 border-t-2 border-dashed border-[#8a97a0]" />
            {t(lang, "emi.legendPaid")}
          </span>
        </div>

        <div className="mt-3 h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.series} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
              <CartesianGrid vertical={false} stroke="rgba(31,41,51,0.07)" />
              <XAxis
                dataKey="m"
                type="number"
                domain={[0, 60]}
                ticks={[0, 6, 12, 24, 36, 48, 60]}
                tickFormatter={(value: number) => monthLabel(lang, value)}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#5f6b76" }}
              />
              <YAxis
                tickFormatter={(value: number) => `${Math.round(value / 100000)}L`}
                axisLine={false}
                tickLine={false}
                width={42}
                tick={{ fontSize: 10, fill: "#5f6b76" }}
              />
              <Tooltip content={<RupeeTooltip lang={lang} />} />
              <Line
                type="monotone"
                dataKey="outstanding"
                name={t(lang, "emi.legendOutstanding")}
                stroke={STORM}
                strokeWidth={2.5}
                dot={false}
                animationDuration={1400}
              />
              <Line
                type="monotone"
                dataKey="paid"
                name={t(lang, "emi.legendPaid")}
                stroke={SLATE}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                animationDuration={1400}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Section>

      {/* Moratorium */}
      <Section>
        <SectionLabel>{t(lang, "mor.title")}</SectionLabel>
        <ol className="mt-4 space-y-3">
          <MoratoriumStep
            index="01"
            title={t(lang, "mor.step1Title", { n: fin.moratoriumMonths })}
            body={t(lang, "mor.step1Body", { rate: fin.ratePct })}
          />
          <MoratoriumStep
            index="02"
            title={t(lang, "mor.step2Title", { n: fin.moratoriumMonths })}
            body={t(lang, "mor.step2Body", {
              from: inr(fin.loan),
              to: inr(fin.moratoriumBalance),
            })}
          />
          <MoratoriumStep
            index="03"
            title={t(lang, "mor.step3Title", {
              a: fin.moratoriumMonths + 1,
              b: fin.tenureMonths,
            })}
            body={t(lang, "mor.step3Body", {
              emi: inr(fin.postEmi),
              months: fin.tenureMonths - fin.moratoriumMonths,
              interest: inr(fin.totalInterest),
            })}
          />
        </ol>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat label={t(lang, "mini.loan")} value={inr(fin.loan)} />
          <MiniStat label={t(lang, "mini.rate")} value={`${fin.ratePct}% ${t(lang, "unit.pa")}`} />
          <MiniStat label={t(lang, "mini.tenure")} value={`${fin.tenureMonths} ${t(lang, "unit.months")}`} />
          <MiniStat label={t(lang, "mini.interest")} value={inr(fin.totalInterest)} />
        </div>
      </Section>
    </Panel>
  );
}

function MoratoriumStep({
  index,
  title,
  body,
}: {
  index: string;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-3.5">
      <span className="mt-0.5 shrink-0 text-[10px] font-semibold tracking-[0.16em] text-[#4f6d7a] tabular-nums">
        {index}
      </span>
      <div>
        <p className="text-[13px] font-semibold leading-snug">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-foreground/10 bg-background/50 p-3">
      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-[15px] font-bold tabular-nums">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ReportPage() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  const data = useMemo(() => {
    const draft = loadDraft();
    return draft ? computeReport(draft) : null;
  }, []);

  if (!data) {
    return <Navigate to="/login" replace />;
  }

  const lang = data.lang || "en";
  const language = languageByCode(data.lang);
  const slide = (fromLeft: boolean, delay: number) => ({
    initial: {
      opacity: 0,
      x: reduced ? 0 : fromLeft ? -56 : 56,
      ...(reduced ? {} : { filter: "blur(10px)" }),
    },
    animate: { opacity: 1, x: 0, filter: "blur(0px)" },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  const restart = () => {
    clearDraft();
    navigate("/");
  };

  const gradeText = gradeLower(lang, data.feasibility.tone);
  const catLabel = sectorLabel(lang, data.category.code);

  return (
    <div
      dir={isRtl(lang) ? "rtl" : undefined}
      lang={lang}
      className="relative min-h-screen overflow-hidden bg-background text-foreground"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-2 z-0 rounded-[3px] border border-foreground/10 sm:inset-3"
      />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Intro row */}
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-2 w-2 bg-[#4f6d7a]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-foreground sm:text-[11px]">
              Hyper
            </span>
            <span aria-hidden="true" className="h-px w-6 bg-border" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:text-[11px]">
              {t(lang, "report.kicker")}
            </span>
          </div>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground sm:text-[11px]"
          >
            <RefreshCw className="size-3.5" />
            {t(lang, "report.action")}
          </button>
        </motion.div>

        {/* Title */}
        <motion.header
          initial={{ opacity: 0, y: reduced ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
          className="mt-10 max-w-3xl"
        >
          <Micro className="text-[#4f6d7a]">
            {t(lang, "report.prepared", { name: data.displayName, date: data.generatedOn })}
          </Micro>
          <h1 className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-[-0.02em] sm:text-5xl">
            <Reveal
              text={t(lang, "report.title", { sector: catLabel, place: data.place })}
              delay={0.25}
            />
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-foreground/85 sm:text-[15px]">
            <Reveal
              delay={0.55}
              text={t(lang, "report.intro", {
                grade: gradeText,
                score: data.feasibility.overall,
                capital: inr(data.capital),
                loan: inr(data.financial.loan),
                deployable: inr(data.financial.deployable),
              })}
            />
          </p>

          {/* Context chips */}
          <div className="mt-7 flex flex-wrap items-center gap-2">
            {[
              { k: t(lang, "report.chipSector"), v: catLabel },
              { k: t(lang, "report.chipPlace"), v: data.place },
              { k: t(lang, "report.chipCapital"), v: inr(data.capital) },
              {
                k: t(lang, "report.chipLanguage"),
                v: `${language.native} · ${language.roman}`,
              },
            ].map((chip) => (
              <span
                key={chip.k}
                className="inline-flex items-baseline gap-2 rounded-full border border-foreground/15 bg-card/70 px-3.5 py-1.5 text-[11px]"
              >
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {chip.k}
                </span>
                <span className="font-medium text-foreground/90">{chip.v}</span>
              </span>
            ))}
          </div>
        </motion.header>

        {/* The two reports — side by side on md+, stacked on small screens */}
        <div className="mt-10 grid grid-cols-1 items-start gap-5 md:grid-cols-2 sm:mt-12">
          <motion.div {...slide(true, 0.4)} className="md:pr-1">
            <FeasibilityCard data={data} />
          </motion.div>
          <motion.div {...slide(false, 0.55)} className="md:pl-1">
            <FinancialCard data={data} />
          </motion.div>
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.4 }}
          className="mx-auto mt-12 max-w-2xl text-center text-[11px] leading-relaxed text-muted-foreground"
        >
          {t(lang, "report.disclaimer")}
        </motion.p>
      </main>
    </div>
  );
}
