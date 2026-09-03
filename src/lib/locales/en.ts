/**
 * English base dictionary — the source of truth for every user-facing string
 * in the Hyper flow (landing chrome, login form, report cards, report
 * narrative generated in hyper.ts).
 *
 * Other locales live in `src/lib/locales/<code>.ts` as partial overrides;
 * any key they do not ship falls back to this English entry (see index.ts).
 * Placeholders use `{name}` tokens, substituted via the `t()` helper.
 */

export const EN = {
  /* ---------------- Landing micro-chrome ---------------- */
  "ui.languages": "Languages",
  "ui.available": "{n} available",
  "ui.selected": "selected",
  "ui.selectPrompt": "Select a language to continue",

  /* ---------------- Login — details form ---------------- */
  "login.back": "Languages",
  "login.step": "Step 2 of 3",
  "login.title": "Tell us about your business",
  "login.subtitle":
    "A few details are enough — Hyper sizes your market and prepares both reports in one go. No sign-up, nothing leaves this device.",
  "login.labelName": "Name",
  "login.phName": "e.g. Priya Sharma",
  "login.labelPlace": "Place",
  "login.phPlace": "e.g. Nashik",
  "login.labelPhone": "Phone number",
  "login.phPhone": "10-digit mobile",
  "login.hintPhone": "Digits only — no +, no 91 prefix.",
  "login.labelCapital": "Capital (₹)",
  "login.phCapital": "e.g. 5,00,000",
  "login.hintCapital": "Amount you can invest to start the business.",
  "login.labelCategory": "Business category",
  "login.phCategory": "Select your sector",
  "login.submit": "Get my report",
  "login.submitting": "Preparing your reports…",
  "login.privacy": "Your details stay on this device — demo build",
  "login.footer": "Hyper · Business blueprint",
  "login.stepMicro": "Step 02 — Details",
  "login.errName": "Please enter your full name.",
  "login.errPlace": "Please enter your city or town.",
  "login.errPhone": "Enter a 10-digit mobile number — digits only, no + or 91.",
  "login.errCapital": "Enter your planned capital in ₹ (digits only).",
  "login.errCategory": "Choose the sector closest to your business.",

  /* ---------------- Report — page chrome ---------------- */
  "report.kicker": "Report ready",
  "report.action": "New assessment",
  "report.prepared": "Prepared for {name} · {date}",
  "report.title": "Your business blueprint for {sector} in {place}",
  "report.intro":
    "Overall feasibility: {grade} ({score}/100). With {capital} of capital, an indicative {loan} financing line funds a {deployable} plan. Both reports below — feasibility on the left, financials on the right.",
  "report.chipSector": "Sector",
  "report.chipPlace": "Place",
  "report.chipCapital": "Capital",
  "report.chipLanguage": "Language",
  "report.aTag": "Report A",
  "report.aTitle": "Business Feasibility",
  "report.bTag": "Report B",
  "report.bTitle": "Financial Calculator",
  "report.disclaimer":
    "Indicative estimates generated locally from your inputs for this demo — not financial advice. Validate figures with a bank, CA or your local DIC before committing. Sector data is illustrative.",

  /* ---------------- Report A — feasibility card ---------------- */
  "f.hint":
    "A {category} venture in {place} rates {grade} feasibility — led by strong {factor1} ({score1}/100) and {factor2} of {score2}%.",
  "f.market": "Market reach",
  "f.statAddressable": "Addressable demand",
  "f.statAddressableSub": "per month, in your catchment",
  "f.statShare": "Realistic share",
  "f.statShareSub": "of the market within 12 months",
  "f.statTurnover": "Expected turnover",
  "f.statTurnoverSub": "steady-state monthly sales",
  "f.statBreakeven": "Break-even sales",
  "f.statBreakevenSub": "against {cost} monthly fixed cost",
  "f.oppTitle": "Opportunity analysis",
  "f.oppBody":
    "Five weighted factors decide the verdict. The bars animate as each factor is read against your local context.",
  "f.score": "Feasibility score",
  "f.swotTitle": "SWOT — where you stand",
  "f.swotS": "Strengths",
  "f.swotW": "Weaknesses",
  "f.swotO": "Opportunities",
  "f.swotT": "Threats",
  "f.compTitle": "Competitor mapping",
  "f.compShare": "{share}% of nearby spending",
  "f.compPricing": "Pricing",
  "f.compEdge": "Edge",
  "f.rangeTo": "to",
  "f.pricingTitle": "Pricing & positioning",
  "f.pricingTicket":
    "typical ticket for {category} is {ticket}; margins run {low}–{high}%.",

  /* ---------------- Report B — financial card ---------------- */
  "fin.hint":
    "Your capital is split across five heads, then checked against typical priority-sector financing terms.",
  "fin.deployChip": "{value} deployable",
  "fin.headsTitle": "Where your {capital} goes",
  "head.fitout": "Fit-out & interiors",
  "head.stock": "Initial stock / raw material",
  "head.equipment": "Equipment & tools",
  "head.working": "Working capital reserve",
  "head.marketing": "Marketing & launch",
  "fin.loanTitle": "Loan eligibility",
  "fin.rowEquity": "Your capital (equity)",
  "fin.rowEquitySub": "Own contribution to the project",
  "fin.rowLine": "Indicative financing line",
  "fin.rowLineSub":
    "≈ {pct}% of project cost · {rate}% p.a. assumed, priority-sector terms",
  "fin.rowProject": "Total project size",
  "fin.rowProjectSub": "Equity + financing, fully deployable",
  "fin.docsTitle": "Keep these documents ready",
  "emi.title": "EMI schedule — 5-year horizon",
  "emi.body":
    "{post} per month after an optional {mor}-month moratorium; {pre} if you start repaying immediately.",
  "emi.legendOutstanding": "Principal outstanding",
  "emi.legendPaid": "Cumulative payments",
  "emi.monthly": "Monthly EMI",
  "emi.today": "Today",
  "emi.chartMo": "{n} mo",
  "emi.chartYr": "{n} yr",
  "mor.title": "Moratorium — how it works for you",
  "mor.step1Title": "Months 1–{n}: repayment pause",
  "mor.step1Body":
    "No EMI pressure while the business finds its feet. Interest at {rate}% p.a. is accrued monthly and added to the principal.",
  "mor.step2Title": "Month {n}: balance capitalises",
  "mor.step2Body":
    "Your outstanding grows from {from} to {to} — the accrued interest is now part of the loan.",
  "mor.step3Title": "Months {a}–{b}: fixed EMI",
  "mor.step3Body":
    "A steady {emi} per month clears the balance over the remaining {months} months. Total interest paid across the loan: {interest}.",
  "mini.loan": "Loan amount",
  "mini.rate": "Rate (assumed)",
  "mini.tenure": "Tenure",
  "mini.interest": "Total interest",
  "unit.pa": "p.a.",
  "unit.months": "months",

  /* ---------------- Grades & factor names ---------------- */
  "grades.high": "High",
  "grades.moderate": "Moderate",
  "grades.conditional": "Conditional",
  "factor.demand": "Demand",
  "factor.margins": "Margins",
  "factor.access": "Market access",
  "factor.capitalFit": "Capital fit",
  "factor.growth": "Growth",
  "factorNote.demand": "Everyday need strength in your sector",
  "factorNote.margins": "Gross margin band {low}–{high}%",
  "factorNote.access": "Room to win share locally",
  "factorNote.capitalFit": "Typical setup ≈ {typical}",
  "factorNote.growth": "Sector compounding ~{growth}%/yr",

  /* ---------------- Sectors (23, incl. the select list) ---------------- */
  "sector.grocery": "Grocery & Kirana",
  "sector.food": "Food Service (Restaurant / Café)",
  "sector.pharmacy": "Pharmacy & Wellness",
  "sector.healthcare": "Healthcare & Clinic",
  "sector.salon_beauty": "Salon & Beauty Care",
  "sector.tailoring": "Tailoring & Alteration",
  "sector.repair": "Repair Services",
  "sector.automobile": "Automobile & Spare Parts",
  "sector.clothing": "Clothing & Apparel Retail",
  "sector.footwear": "Footwear Retail",
  "sector.electronics": "Electronics Retail",
  "sector.mobile": "Mobile & Accessories",
  "sector.hardware": "Hardware & Building Materials",
  "sector.agriculture": "Agriculture & Agro Services",
  "sector.education": "Education & Coaching",
  "sector.printing_stationery": "Printing & Stationery",
  "sector.financial": "Financial Services (DSA / Insurance)",
  "sector.others": "Other Business",
  "sector.transport": "Transport & Logistics",
  "sector.construction_realestate": "Construction & Real Estate Services",
  "sector.wholesale_trade": "Wholesale Trade",
  "sector.furniture": "Furniture & Woodwork",
  "sector.professional_services": "Professional Services",

  /* ---------------- SWOT sentence patterns (hyper.ts) ---------------- */
  "swot.s1": "Sustained, repeat demand for {category} in your catchment.",
  "swot.s2":
    "Healthy operating margins ({low}–{high}%) leave room for rent, staff and price offers.",
  "swot.s3":
    "Relatively less crowded field — a well-run local shop can own the neighbourhood.",
  "swot.s4a": "Startup capital is at or above the typical setup for this sector.",
  "swot.s4b": "Lean launch profile — low fixed commitments keep month-one risk small.",
  "swot.s5": "Sector tailwind of ~{growth}% yearly demand growth.",
  "swot.s6": "Direct, owner-run service quality beats chain consistency nearby.",
  "swot.w1":
    "Capital is lean against a typical {category} setup of ~{typical} — sequence spending.",
  "swot.w2a": "Aggressive organised players (chains + marketplaces) compete on price.",
  "swot.w2b":
    "Moderate competitive pressure — differentiation will decide footfall.",
  "swot.w2c":
    "Differentiation is still needed; category margins reward focused offers.",
  "swot.w3":
    "Early months depend on a small number of repeat customers — nurture them.",
  "swot.w4": "Working capital discipline will matter until sales stabilise.",
  "swot.o1":
    "{growth}% category growth + rising local spending favour a new entrant.",
  "swot.o2": "Festive and season-end demand spikes reward advance stock planning.",
  "swot.o3":
    "Society groups, offices and schools nearby are a reachable repeat channel.",
  "swot.o4": "Digital maps + local WhatsApp presence make discovery cheap.",
  "swot.t1": "Price pressure from chains and quick-commerce in the first year.",
  "swot.t2": "Rent and input-cost inflation can compress thin months.",
  "swot.t3": "Licence / compliance paperwork can slow the launch window.",
  "swot.t4":
    "Seasonal dips — plan a marketing reserve for the first two quarters.",

  /* ---------------- Competitor descriptors ---------------- */
  "comp.online": "Online marketplaces",
  "comp.local": "Local players around {place}",
  "compFmt.chain": "Chain / brand",
  "compFmt.online": "Apps & quick commerce",
  "compFmt.local": "Store / service units",
  "compPrice.chain": "Band pricing, frequent offers",
  "compPrice.online": "Discount-led, home delivery",
  "compPrice.local": "Flexible, relationship pricing",
  "compEdge.chain": "Assortment, trust, shelf power",
  "compEdge.online": "Convenience and reach",
  "compEdge.local": "Proximity, service, credit",

  /* ---------------- Docs chips ---------------- */
  "docs.pan": "PAN card",
  "docs.aadhaar": "Aadhaar",
  "docs.bank": "Bank statements (6 months)",
  "docs.address": "Address proof",

  /* ---------------- Pricing positioning ---------------- */
  "pricing.high":
    "Lead with quality and service at the upper band ({low}–{high}); margins of {mLow}–{mHigh}% carry a premium positioning.",
  "pricing.low":
    "Compete on convenience and pack value at the lower band ({low}–{high}); high volume offsets thin {mLow}–{mHigh}% margins.",
} as const;

export type UiKey = keyof typeof EN;

export type LocaleEntry = Partial<Record<UiKey, string>>;
