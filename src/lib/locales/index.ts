/**
 * Locale registry for the Hyper flow.
 *
 * Coverage model (mirrors src/lib/languages.ts): the twelve "core" languages
 * below ship complete copy for the whole app (landing chrome, login form,
 * report cards and generated narrative). Every other language offered on the
 * language picker falls back to English copy — the same graceful-fallback
 * behaviour the landing page already applies to hero copy.
 */
import { EN, type LocaleEntry, type UiKey } from "./en";
import { hi } from "./hi";
import { mr } from "./mr";
import { bn } from "./bn";
import { ta } from "./ta";
import { te } from "./te";
import { kn } from "./kn";
import { ml } from "./ml";
import { gu } from "./gu";
import { or } from "./or";
import { pa } from "./pa";
import { ur } from "./ur";

const OVERRIDES: Record<string, LocaleEntry> = {
  en: {},
  hi,
  mr,
  bn,
  ta,
  te,
  kn,
  ml,
  gu,
  or,
  pa,
  ur,
};

/** Language codes that read right-to-left (Urdu chrome etc.). */
export const RTL_CODES = new Set(["ur", "sd", "ks"]);

/** Codes that ship a full localized copy of the app flow. */
export const LOCALIZED_CODES = new Set(Object.keys(OVERRIDES));

/** Replace `{token}` placeholders with values. */
export const interp = (template: string, vars?: Record<string, string | number>): string => {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
};

/**
 * Look up a copy string for a language with English fallback.
 * @example t("hi", "login.title")
 * @example t("hi", "report.title", { sector: "किराना", place: "नाशिक" })
 */
export const t = (
  code: string,
  key: UiKey,
  vars?: Record<string, string | number>,
): string => {
  const localized = OVERRIDES[code]?.[key];
  const base = EN[key];
  return interp(localized ?? base, vars);
};

/** Whether this language reads right-to-left. */
export const isRtl = (code: string): boolean => RTL_CODES.has(code);
