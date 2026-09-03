/**
 * Hyper — deterministic demo engine.
 *
 * Everything downstream (feasibility read, competitor map, financing plan,
 * EMI schedules) is derived from the user's own inputs (category, capital,
 * place) via this module. No network calls — pure, stable functions so the
 * report is reproducible and refresh-safe.
 */

export type CategoryCode =
  | "grocery"
  | "food"
  | "pharmacy"
  | "healthcare"
  | "salon_beauty"
  | "tailoring"
  | "repair"
  | "automobile"
  | "clothing"
  | "footwear"
  | "electronics"
  | "mobile"
  | "hardware"
  | "agriculture"
  | "education"
  | "printing_stationery"
  | "financial"
  | "others"
  | "transport"
  | "construction_realestate"
  | "wholesale_trade"
  | "furniture"
  | "professional_services";

export type SectorSpec = {
  code: CategoryCode;
  label: string;
  chain: string;
  licence: string;
  /** 0–100, everyday demand strength. */
  demand: number;
  /** 0–100, intensity of competition (higher = tougher). */
  competition: number;
  marginLow: number;
  marginHigh: number;
  /** % year-over-year category growth. */
  growth: number;
  /** Typical setup cost for this sector, ₹. */
  typical: number;
  /** Typical customer ticket, ₹. */
  ticket: number;
  /** Split of own capital across spend heads (sums to 100). */
  split: { fitout: number; stock: number; equipment: number; working: number; marketing: number };
};

type Row = [
  code: CategoryCode,
  label: string,
  chain: string,
  licence: string,
  demand: number,
  competition: number,
  marginLow: number,
  marginHigh: number,
  growth: number,
  typical: number,
  ticket: number,
  fitout: number,
  stock: number,
  equipment: number,
  working: number,
  marketing: number,
];

const ROWS: Row[] = [
  ["grocery", "Grocery & Kirana", "Supermarket & quick-commerce chains", "Trade licence / FSSAI", 88, 74, 12, 20, 8, 400000, 400, 20, 55, 5, 15, 5],
  ["food", "Food Service (Restaurant / Café)", "Quick-service restaurant chains", "FSSAI licence", 84, 80, 40, 60, 10, 600000, 300, 30, 40, 15, 10, 5],
  ["pharmacy", "Pharmacy & Wellness", "Pharmacy retail chains", "Drug licence (Form 20/21)", 82, 64, 18, 28, 9, 500000, 350, 18, 55, 8, 12, 7],
  ["healthcare", "Healthcare & Clinic", "Corporate clinics & diagnostics", "Clinic / medical registration", 78, 55, 35, 55, 12, 700000, 700, 28, 30, 25, 10, 7],
  ["salon_beauty", "Salon & Beauty Care", "Salon chains & academies", "Trade licence", 74, 66, 55, 70, 11, 350000, 550, 25, 20, 30, 15, 10],
  ["tailoring", "Tailoring & Alteration", "Fast-fashion brands", "Trade licence", 62, 52, 50, 70, 7, 250000, 800, 22, 25, 35, 12, 6],
  ["repair", "Repair Services", "Brand service centres", "Trade licence", 68, 60, 35, 55, 8, 300000, 650, 18, 22, 35, 18, 7],
  ["automobile", "Automobile & Spare Parts", "Multi-brand dealerships", "Trade licence", 80, 70, 12, 22, 9, 600000, 900, 26, 42, 20, 8, 4],
  ["clothing", "Clothing & Apparel Retail", "Apparel brands & malls", "Trade licence / GSTIN", 76, 74, 28, 45, 10, 450000, 1300, 24, 52, 8, 10, 6],
  ["footwear", "Footwear Retail", "Footwear brands & chains", "Trade licence / GSTIN", 70, 66, 25, 40, 9, 350000, 950, 22, 55, 7, 10, 6],
  ["electronics", "Electronics Retail", "National electronics chains", "Trade licence / GSTIN", 74, 70, 14, 24, 11, 700000, 9000, 22, 50, 8, 13, 7],
  ["mobile", "Mobile & Accessories", "Mobile retail chains", "Trade licence / GSTIN", 81, 76, 10, 18, 12, 400000, 13000, 20, 55, 6, 12, 7],
  ["hardware", "Hardware & Building Materials", "Building-material platforms", "Trade licence", 66, 55, 18, 30, 9, 500000, 800, 24, 48, 8, 13, 7],
  ["agriculture", "Agriculture & Agro Services", "Agri-input companies", "Land records / licences", 72, 48, 30, 45, 13, 800000, 6000, 15, 35, 35, 10, 5],
  ["education", "Education & Coaching", "Ed-tech & institutes", "Institute registration", 71, 50, 35, 55, 11, 400000, 2500, 26, 20, 32, 14, 8],
  ["printing_stationery", "Printing & Stationery", "Corporate print aggregators", "Trade licence", 60, 45, 28, 42, 8, 350000, 500, 30, 30, 22, 12, 6],
  ["financial", "Financial Services (DSA / Insurance)", "Fintech platforms & NBFCs", "Branch / DSA registration", 74, 58, 25, 45, 12, 250000, 2000, 30, 15, 28, 18, 9],
  ["others", "Other Business", "Organised general retail", "Trade licence", 60, 50, 25, 45, 8, 300000, 800, 25, 35, 20, 12, 8],
  ["transport", "Transport & Logistics", "Ride-hail & fleet aggregators", "Vehicle permits", 77, 62, 18, 30, 9, 900000, 700, 28, 30, 25, 10, 7],
  ["construction_realestate", "Construction & Real Estate Services", "Real-estate aggregators", "Contractor licence", 75, 66, 18, 32, 12, 1200000, 35000, 22, 40, 18, 13, 7],
  ["wholesale_trade", "Wholesale Trade", "B2B marketplaces & mandis", "Trade licence / GSTIN", 72, 70, 10, 18, 10, 1500000, 12000, 15, 60, 5, 14, 6],
  ["furniture", "Furniture & Woodwork", "Furniture brands & showrooms", "Trade licence", 68, 58, 30, 50, 9, 600000, 16000, 28, 35, 25, 7, 5],
  ["professional_services", "Professional Services", "Freelance marketplaces & firms", "Service registration", 76, 56, 40, 70, 13, 300000, 3500, 22, 12, 30, 24, 12],
];

export const SECTORS: SectorSpec[] = ROWS.map(
  ([code, label, chain, licence, demand, competition, marginLow, marginHigh, growth, typical, ticket, fitout, stock, equipment, working, marketing]) => ({
    code,
    label,
    chain,
    licence,
    demand,
    competition,
    marginLow,
    marginHigh,
    growth,
    typical,
    ticket,
    split: { fitout, stock, equipment, working, marketing },
  }),
);

export const sectorByCode = (code: string): SectorSpec =>
  SECTORS.find((s) => s.code === code) ?? SECTORS.find((s) => s.code === "others")!;

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                  */
/* ------------------------------------------------------------------ */

export const inr = (value: number): string =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

export const roundTo = (value: number, step: number): number =>
  Math.max(0, Math.round(value / step) * step);

export const properName = (name: string): string =>
  name
    .trim()
    .toLowerCase()
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase());

/** Stable, small hash so the same place always yields the same demo numbers. */
export const hashText = (text: string): number => {
  let hash = 5381;
  const lower = text.toLowerCase().trim();
  for (let i = 0; i < lower.length; i += 1) {
    hash = (hash * 33) ^ lower.charCodeAt(i);
  }
  return Math.abs(hash);
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/** Typical monthly spend per nearby household/consumer, by sector (₹). */
const monthlySpendByCode = (code: CategoryCode): number => {
  switch (code) {
    case "grocery": return 2200;
    case "food": return 1400;
    case "pharmacy": return 500;
    case "healthcare": return 600;
    case "salon_beauty": return 450;
    case "tailoring": return 250;
    case "repair": return 300;
    case "automobile": return 800;
    case "clothing": return 1200;
    case "footwear": return 350;
    case "electronics": return 900;
    case "mobile": return 400;
    case "hardware": return 350;
    case "agriculture": return 2500;
    case "education": return 1200;
    case "printing_stationery": return 150;
    case "financial": return 300;
    case "transport": return 1500;
    case "construction_realestate": return 2000;
    case "wholesale_trade": return 4000;
    case "furniture": return 700;
    case "professional_services": return 800;
    default: return 500;
  }
};

/* ------------------------------------------------------------------ */
/* Finance                                                             */
/* ------------------------------------------------------------------ */

export const LOAN_RATE_PCT = 9.5;
export const LOAN_TENURE_MONTHS = 60;
export const MORATORIUM_MONTHS = 6;

const emi = (principal: number, annualRatePct: number, months: number): number => {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
};

/* ------------------------------------------------------------------ */
/* Report model                                                        */
/* ------------------------------------------------------------------ */

export type DraftInput = {
  lang: string;
  name: string;
  place: string;
  phone: string;
  capital: number;
  category: CategoryCode;
};

export type Factor = { key: string; value: number; note: string };

export type Swot = { s: string[]; w: string[]; o: string[]; t: string[] };

export type Competitor = {
  name: string;
  format: string;
  share: number;
  pricing: string;
  edge: string;
};

export type FeasibilityModel = {
  overall: number;
  grade: "High" | "Moderate" | "Conditional";
  tone: "high" | "moderate" | "conditional";
  addressableMonthly: number;
  capturePct: number;
  capturedMonthly: number;
  breakEvenSales: number;
  fixedMonthly: number;
  factors: Factor[];
  swot: Swot;
  competitors: Competitor[];
  pricing: {
    ticket: number;
    bandLow: number;
    bandHigh: number;
    marginLow: number;
    marginHigh: number;
    positioning: string;
  };
};

export type HeadAllocation = { key: string; amount: number; pct: number };

export type FinancialModel = {
  capital: number;
  project: number;
  loan: number;
  deployable: number;
  ratePct: number;
  tenureMonths: number;
  moratoriumMonths: number;
  preEmi: number;
  postEmi: number;
  moratoriumBalance: number;
  totalInterest: number;
  totalPaid: number;
  heads: HeadAllocation[];
  docs: string[];
};

export type MonthlyPoint = { m: number; outstanding: number; paid: number };

export type ReportData = {
  lang: string;
  name: string;
  displayName: string;
  place: string;
  category: SectorSpec;
  capital: number;
  generatedOn: string;
  feasibility: FeasibilityModel;
  financial: FinancialModel;
  series: MonthlyPoint[];
};

export function computeReport(input: DraftInput): ReportData {
  const capital = clamp(Math.round(input.capital), 0, 10_000_000_000);
  const cat = sectorByCode(input.category);
  const hash = hashText(`${input.place}|${cat.code}`);
  const margin = (cat.marginLow + cat.marginHigh) / 2;

  /* ---------- Feasibility ---------- */

  const capitalFit = clamp(Math.round(35 + (capital / cat.typical) * 55), 0, 100);
  const access = clamp(100 - cat.competition, 0, 100);
  const growthScore = clamp(Math.round(cat.growth * 7), 0, 100);

  const factors: Factor[] = [
    { key: "Demand", value: cat.demand, note: "Everyday need strength in your sector" },
    { key: "Margins", value: Math.round(margin), note: `Gross margin band ${cat.marginLow}–${cat.marginHigh}%` },
    { key: "Market access", value: access, note: "Room to win share locally" },
    { key: "Capital fit", value: capitalFit, note: `Typical setup ≈ ${inr(cat.typical)}` },
    { key: "Growth", value: growthScore, note: `Sector compounding ~${cat.growth}%/yr` },
  ];

  const overall = Math.round(
    cat.demand * 0.3 +
      margin * 0.18 +
      access * 0.2 +
      capitalFit * 0.2 +
      growthScore * 0.12,
  );
  const grade =
    overall >= 72 ? "High" : overall >= 55 ? "Moderate" : "Conditional";
  const tone = grade === "High" ? "high" : grade === "Moderate" ? "moderate" : "conditional";

  /* Market sizing — deterministic from place + sector (₹ per month). */
  const catchmentUnits = 8000 + (hash % 80) * 500; // households / consumers nearby
  const perUnitSpend = monthlySpendByCode(cat.code); // typical monthly category spend per unit
  const addressableMonthly = Math.round(catchmentUnits * perUnitSpend);
  const capturePct = Number(
    clamp(1.4 + (100 - cat.competition) * 0.05 + (capital / cat.typical) * 2.2, 2, 11).toFixed(1),
  );
  const capturedMonthly = Math.round((addressableMonthly * capturePct) / 100);
  const fixedMonthly = roundTo(
    Math.max(9000, capital * 0.022 + cat.typical * 0.012),
    1000,
  );
  const breakEvenSales = Math.round(fixedMonthly / (margin / 100));

  /* SWOT — rules from the sector profile + user context. */
  const swot: Swot = { s: [], w: [], o: [], t: [] };
  if (cat.demand >= 80) swot.s.push(`Sustained, repeat demand for ${cat.label.toLowerCase()} in your catchment.`);
  if (cat.marginHigh - cat.marginLow >= 18) swot.s.push(`Healthy operating margins (${cat.marginLow}–${cat.marginHigh}%) leave room for rent, staff and price offers.`);
  if (cat.competition <= 60) swot.s.push("Relatively less crowded field — a well-run local shop can own the neighbourhood.");
  if (capitalFit >= 85) swot.s.push("Startup capital is at or above the typical setup for this sector.");
  else swot.s.push("Lean launch profile — low fixed commitments keep month-one risk small.");
  if (cat.growth >= 11) swot.s.push(`Sector tailwind of ~${cat.growth}% yearly demand growth.`);
  if (swot.s.length < 3) swot.s.push("Direct, owner-run service quality beats chain consistency nearby.");

  if (capitalFit < 70) swot.w.push(`Capital is lean against a typical ${cat.label.toLowerCase()} setup of ~${inr(cat.typical)} — sequence spending.`);
  if (cat.competition >= 72) swot.w.push("Aggressive organised players (chains + marketplaces) compete on price.");
  else if (cat.competition >= 62) swot.w.push("Moderate competitive pressure — differentiation will decide footfall.");
  else swot.w.push("Differentiation is still needed; category margins reward focused offers.");
  if (swot.w.length < 3) swot.w.push("Early months depend on a small number of repeat customers — nurture them.");
  if (swot.w.length < 3) swot.w.push("Working capital discipline will matter until sales stabilise.");

  swot.o.push(`${cat.growth}% category growth + rising local spending favour a new entrant.`);
  swot.o.push("Festive and season-end demand spikes reward advance stock planning.");
  swot.o.push("Society groups, offices and schools nearby are a reachable repeat channel.");
  if (swot.o.length < 3) swot.o.push("Digital maps + local WhatsApp presence make discovery cheap.");

  if (cat.competition >= 70) swot.t.push("Price pressure from chains and quick-commerce in the first year.");
  swot.t.push("Rent and input-cost inflation can compress thin months.");
  swot.t.push("Licence / compliance paperwork can slow the launch window.");
  if (swot.t.length < 3) swot.t.push("Seasonal dips — plan a marketing reserve for the first two quarters.");

  /* Competitor map. */
  const chainShare = clamp(Math.round(cat.competition * 0.55 - 8), 8, 55);
  const onlineShare = clamp(Math.round(cat.competition * 0.22 + 4), 4, 30);
  const localShare = clamp(100 - chainShare - onlineShare, 8, 60);
  const competitors: Competitor[] = [
    {
      name: cat.chain,
      format: "Chain / brand",
      share: chainShare,
      pricing: "Band pricing, frequent offers",
      edge: "Assortment, trust, shelf power",
    },
    {
      name: "Online marketplaces",
      format: "Apps & quick commerce",
      share: onlineShare,
      pricing: "Discount-led, home delivery",
      edge: "Convenience and reach",
    },
    {
      name: `Local players around ${properName(input.place)}`,
      format: "Store / service units",
      share: localShare,
      pricing: "Flexible, relationship pricing",
      edge: "Proximity, service, credit",
    },
  ];

  const bandLow = roundTo(cat.ticket * 0.82, 10);
  const bandHigh = roundTo(cat.ticket * 1.18, 10);
  const positioning =
    margin >= 32
      ? `Lead with quality and service at the upper band (${inr(bandLow)}–${inr(bandHigh)}); margins of ${cat.marginLow}–${cat.marginHigh}% carry a premium positioning.`
      : `Compete on convenience and pack value at the lower band (${inr(bandLow)}–${inr(bandHigh)}); high volume offsets thin ${cat.marginLow}–${cat.marginHigh}% margins.`;

  const feasibility: FeasibilityModel = {
    overall,
    grade,
    tone,
    addressableMonthly,
    capturePct,
    capturedMonthly,
    breakEvenSales,
    fixedMonthly,
    factors,
    swot,
    competitors,
    pricing: {
      ticket: cat.ticket,
      bandLow,
      bandHigh,
      marginLow: cat.marginLow,
      marginHigh: cat.marginHigh,
      positioning,
    },
  };

  /* ---------- Financial ---------- */

  const project = capital;
  const loan = roundTo(project * 0.62, 10_000);
  const deployable = project + loan;
  const heads: HeadAllocation[] = [
    { key: "Fit-out & interiors", amount: roundTo((project * cat.split.fitout) / 100, 100), pct: cat.split.fitout },
    { key: "Initial stock / raw material", amount: roundTo((project * cat.split.stock) / 100, 100), pct: cat.split.stock },
    { key: "Equipment & tools", amount: roundTo((project * cat.split.equipment) / 100, 100), pct: cat.split.equipment },
    { key: "Working capital reserve", amount: roundTo((project * cat.split.working) / 100, 100), pct: cat.split.working },
    { key: "Marketing & launch", amount: roundTo((project * cat.split.marketing) / 100, 100), pct: cat.split.marketing },
  ];

  const ratePct = LOAN_RATE_PCT;
  const tenureMonths = LOAN_TENURE_MONTHS;
  const moratoriumMonths = MORATORIUM_MONTHS;
  const preEmi = emi(loan, ratePct, tenureMonths);
  let balance = loan;
  for (let m = 0; m < moratoriumMonths; m += 1) balance *= 1 + ratePct / 100 / 12;
  const moratoriumBalance = balance;
  const postEmi = emi(balance, ratePct, tenureMonths - moratoriumMonths);

  /* Amortisation path with the moratorium built in. */
  const series: MonthlyPoint[] = [];
  let bal = loan;
  let interestCum = 0;
  let paidCum = 0;
  const rM = ratePct / 100 / 12;
  series.push({ m: 0, outstanding: Math.round(bal), paid: 0 });
  for (let m = 1; m <= tenureMonths; m += 1) {
    if (m <= moratoriumMonths) {
      interestCum += bal * rM;
      bal += bal * rM;
    } else {
      const interest = bal * rM;
      const principalBit = postEmi - interest;
      interestCum += interest;
      paidCum += postEmi;
      bal -= principalBit;
    }
    series.push({
      m,
      outstanding: Math.max(0, Math.round(bal)),
      paid: Math.round(paidCum),
    });
  }
  const totalPaid = Math.round(paidCum); // payments begin after the moratorium
  const totalInterest = Math.round(interestCum);

  const docs = [
    "PAN card",
    "Aadhaar",
    "Bank statements (6 months)",
    "Address proof",
    cat.licence,
  ];

  const financial: FinancialModel = {
    capital: project,
    project,
    loan,
    deployable,
    ratePct,
    tenureMonths,
    moratoriumMonths,
    preEmi: Math.round(preEmi),
    postEmi: Math.round(postEmi),
    moratoriumBalance: Math.round(moratoriumBalance),
    totalInterest,
    totalPaid,
    heads,
    docs,
  };

  return {
    lang: input.lang,
    name: input.name.trim().toLowerCase(),
    displayName: properName(input.name),
    place: properName(input.place),
    category: cat,
    capital: project,
    generatedOn: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    feasibility,
    financial,
    series,
  };
}

export const SESSION_KEY = "hyper:draft:v1";

export const loadDraft = (): DraftInput | null => {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DraftInput>;
    if (
      typeof parsed.name !== "string" ||
      parsed.name.trim().length < 2 ||
      typeof parsed.place !== "string" ||
      parsed.place.trim().length < 2 ||
      typeof parsed.phone !== "string" ||
      typeof parsed.capital !== "number" ||
      !Number.isFinite(parsed.capital) ||
      parsed.capital <= 0 ||
      typeof parsed.category !== "string"
    ) {
      return null;
    }
    return parsed as DraftInput;
  } catch {
    return null;
  }
};

export const saveDraft = (draft: DraftInput): void => {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(draft));
};

export const clearDraft = (): void => {
  window.sessionStorage.removeItem(SESSION_KEY);
};
