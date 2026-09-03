import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Micro, Reveal } from "@/components/studio-kit";
import { languageByCode } from "@/lib/languages";
import {
  SECTORS,
  saveDraft,
  type CategoryCode,
  type DraftInput,
} from "@/lib/hyper";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sectorsSorted = [...SECTORS].sort((a, b) =>
  a.label.localeCompare(b.label),
);

type FieldErrors = Partial<
  Record<"name" | "place" | "phone" | "capital" | "category", string>
>;

const cleanPhone = (raw: string): string => {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length > 10) digits = digits.slice(2);
  return digits.slice(0, 10);
};

const PREFILL_KEY = "hyper:prefill:v1";

const emptyPrefill = () => ({
  name: "",
  place: "",
  phone: "",
  capitalRaw: "",
  category: "" as CategoryCode | "",
});

/** Restore what the user typed if they come back from the report. */
const loadPrefill = (): {
  name: string;
  place: string;
  phone: string;
  capitalRaw: string;
  category: CategoryCode | "";
} => {
  try {
    const raw = window.sessionStorage.getItem(PREFILL_KEY);
    if (!raw) return emptyPrefill();
    const parsed = JSON.parse(raw) as Partial<Record<string, unknown>>;
    const pick = (key: string): string =>
      typeof parsed[key] === "string" ? (parsed[key] as string) : "";
    const category = pick("category");
    return {
      name: pick("name"),
      place: pick("place"),
      phone: pick("phone"),
      capitalRaw: pick("capitalRaw"),
      category: SECTORS.some((s) => s.code === category)
        ? (category as CategoryCode)
        : "",
    };
  } catch {
    return emptyPrefill();
  }
};

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/70 sm:text-[11px]">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-[#a0433e]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function LoginPage() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lang = languageByCode(searchParams.get("lang") ?? "en");

  const [prefill] = useState(loadPrefill);
  const [name, setName] = useState(prefill.name);
  const [place, setPlace] = useState(prefill.place);
  const [phone, setPhone] = useState(prefill.phone);
  const [capitalRaw, setCapitalRaw] = useState(prefill.capitalRaw);
  const [category, setCategory] = useState<CategoryCode | "">(prefill.category);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const capitalPretty = useMemo(() => {
    if (!capitalRaw) return "";
    const value = Number.parseInt(capitalRaw, 10);
    return Number.isFinite(value) ? value.toLocaleString("en-IN") : capitalRaw;
  }, [capitalRaw]);

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = "Please enter your full name.";
    if (place.trim().length < 2) next.place = "Please enter your city or town.";
    if (phone.length !== 10)
      next.phone = "Enter a 10-digit mobile number — digits only, no + or 91.";
    const capital = Number.parseInt(capitalRaw, 10);
    if (!capitalRaw || !Number.isFinite(capital) || capital <= 0)
      next.capital = "Enter your planned capital in ₹ (digits only).";
    if (!category) next.category = "Choose the sector closest to your business.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Keep a working copy so a back-navigation to this screen keeps entries.
  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        PREFILL_KEY,
        JSON.stringify({ name, place, phone, capitalRaw, category }),
      );
    } catch {
      // non-fatal — storage may be unavailable
    }
  }, [name, place, phone, capitalRaw, category]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const draft: DraftInput = {
      lang: lang.code,
      name: name.trim().toLowerCase(),
      place: place.trim().toLowerCase(),
      phone,
      capital: Number.parseInt(capitalRaw, 10),
      category: category as CategoryCode,
    };
    // Keep the draft in session storage so the report survives refreshes.
    window.setTimeout(() => {
      saveDraft(draft);
      navigate("/report");
    }, 450);
  };

  const inputClass =
    "h-11 w-full rounded-md border border-input bg-background/60 text-[15px] text-foreground shadow-none transition-colors focus-visible:border-[#4f6d7a] focus-visible:ring-[3px] focus-visible:ring-[#4f6d7a]/25";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-2 z-0 rounded-[3px] border border-foreground/10 sm:inset-3"
      />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 py-16 sm:px-8 sm:py-24">
        {/* Top chrome */}
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
          className="flex w-full items-center justify-between"
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground sm:text-[11px]"
          >
            <ArrowLeft className="size-3.5" />
            Languages
          </button>
          <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
            {lang.native}
            <span className="text-[#4f6d7a]">·</span>
            {lang.roman}
          </span>
        </motion.div>

        {/* Intro */}
        <motion.header
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
          className="mt-14 flex flex-col items-center text-center sm:mt-16"
        >
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-2 w-2 bg-[#4f6d7a]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-foreground sm:text-[11px]">
              Hyper
            </span>
            <span aria-hidden="true" className="h-px w-6 bg-border" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:text-[11px]">
              Step 2 of 3
            </span>
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold leading-[1.12] tracking-[-0.02em] sm:text-5xl">
            <Reveal text="Tell us about your business" delay={0.25} />
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            A few details are enough — Hyper sizes your market and prepares
            both reports in one go. No sign-up, nothing leaves this device.
          </p>
        </motion.header>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
          className="mt-10 w-full rounded-md border border-foreground/12 bg-card/85 p-6 shadow-[0_40px_90px_-60px_rgba(31,41,51,0.55)] sm:mt-12 sm:p-8"
        >
          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="e.g. Priya Sharma"
                autoComplete="name"
                className={inputClass}
              />
            </Field>

            <Field label="Place" error={errors.place}>
              <Input
                value={place}
                onChange={(e) => {
                  setPlace(e.target.value);
                  if (errors.place) setErrors((prev) => ({ ...prev, place: undefined }));
                }}
                placeholder="e.g. Nashik"
                autoComplete="address-level2"
                className={inputClass}
              />
            </Field>

            <Field label="Phone number" error={errors.phone}>
              <Input
                value={phone}
                onChange={(e) => {
                  setPhone(cleanPhone(e.target.value));
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                placeholder="10-digit mobile"
                inputMode="numeric"
                autoComplete="tel-national"
                className={cn(inputClass, "tracking-[0.08em] tabular-nums")}
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Digits only — no +, no 91 prefix.
              </p>
            </Field>

            <Field label="Capital (₹)" error={errors.capital}>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-[15px] font-semibold text-muted-foreground"
                >
                  ₹
                </span>
                <Input
                  value={capitalPretty}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d]/g, "").slice(0, 9);
                    setCapitalRaw(raw);
                    if (errors.capital) setErrors((prev) => ({ ...prev, capital: undefined }));
                  }}
                  placeholder="e.g. 5,00,000"
                  inputMode="numeric"
                  className={cn(inputClass, "pl-8 tabular-nums")}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Amount you can invest to start the business.
              </p>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Business category" error={errors.category}>
                <Select
                  value={category || undefined}
                  onValueChange={(value) => {
                    setCategory(value as CategoryCode);
                    if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
                  }}
                >
                  <SelectTrigger className="h-11 w-full rounded-md border-input bg-background/60 text-[15px] shadow-none">
                    <SelectValue placeholder="Select your sector" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {sectorsSorted.map((sector) => (
                      <SelectItem key={sector.code} value={sector.code}>
                        {sector.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="mt-2 flex flex-col gap-3 sm:col-span-2">
              <Button
                type="submit"
                disabled={submitting}
                className="group h-12 w-full rounded-md bg-[#4f6d7a] px-6 text-[15px] font-semibold tracking-[0.01em] text-[#f6fafc] transition-all duration-300 hover:bg-[#425e69] hover:shadow-[0_18px_40px_-16px_rgba(79,109,122,0.65)] focus-visible:ring-[#4f6d7a]/40"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Preparing your reports…
                  </>
                ) : (
                  <>
                    Get my report
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
              <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Your details stay on this device — demo build
              </p>
            </div>
          </form>
        </motion.div>

        {/* Bottom microline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}
          className="mt-10 flex w-full items-center justify-between gap-6 border-t border-foreground/10 pt-4"
        >
          <Micro>Hyper · Business blueprint</Micro>
          <Micro className="text-right tabular-nums">Step 02 — Details</Micro>
        </motion.div>
      </main>
    </div>
  );
}
