import { findCountryByDialCode, getCountry } from "./countries";
import type { CountryCode, CountryData, LineType, Operator, PhoneInfo } from "./types";

interface Resolved {
  country: CountryData;
  national: string;
}

function longestMatch(national: string, prefixes: string[]): number {
  let best = 0;
  for (const prefix of prefixes) {
    if (prefix.length > best && national.startsWith(prefix)) best = prefix.length;
  }
  return best;
}

function resolve(input: string, countryCode?: CountryCode): Resolved | null {
  let digits = input.replace(/[\s.\-()/]/g, "");
  let international = false;

  if (digits.startsWith("+")) {
    digits = digits.slice(1);
    international = true;
  } else if (digits.startsWith("00")) {
    digits = digits.slice(2);
    international = true;
  }

  if (!/^\d+$/.test(digits)) return null;

  if (international) {
    const country = countryCode ? getCountry(countryCode) : findCountryByDialCode(digits);
    if (!country || !digits.startsWith(country.dialCode)) return null;
    return { country, national: digits.slice(country.dialCode.length) };
  }

  if (!countryCode) return null;
  const country = getCountry(countryCode);
  if (digits.length === country.dialCode.length + country.nationalLength && digits.startsWith(country.dialCode)) {
    return { country, national: digits.slice(country.dialCode.length) };
  }
  return { country, national: digits };
}

function lineType(national: string, country: CountryData): LineType | null {
  const mobile = longestMatch(national, country.mobilePrefixes);
  const fixed = longestMatch(national, country.fixedPrefixes);
  if (!mobile && !fixed) return null;
  return fixed > mobile ? "fixed" : "mobile";
}

function findOperator(national: string, country: CountryData): Operator | null {
  let best: Operator | null = null;
  let bestLength = 0;
  for (const operator of country.operators) {
    const length = longestMatch(national, operator.prefixes);
    if (length > bestLength) {
      best = operator;
      bestLength = length;
    }
  }
  return best;
}

function group(national: string, sizes: number[]): string {
  const parts: string[] = [];
  let index = 0;
  for (const size of sizes) {
    parts.push(national.slice(index, index + size));
    index += size;
  }
  if (index < national.length) parts.push(national.slice(index));
  return parts.filter(Boolean).join(" ");
}

export function parse(input: string, country?: CountryCode): PhoneInfo | null {
  const resolved = resolve(input, country);
  if (!resolved) return null;

  const { country: data, national } = resolved;
  if (national.length !== data.nationalLength) return null;

  const type = lineType(national, data);
  if (!type) return null;

  const operator = findOperator(national, data);
  return {
    country: data.code,
    national,
    international: `+${data.dialCode}${national}`,
    type,
    operator: operator?.name ?? null,
    wallet: operator?.wallet ?? null,
  };
}

export function isValid(input: string, country?: CountryCode): boolean {
  return parse(input, country) !== null;
}

export function normalize(input: string, country?: CountryCode): string | null {
  return parse(input, country)?.international ?? null;
}

export function detectOperator(
  input: string,
  country?: CountryCode,
): { country: CountryCode; operator: string; wallet: string | null } | null {
  const info = parse(input, country);
  if (!info?.operator) return null;
  return { country: info.country, operator: info.operator, wallet: info.wallet };
}

export function format(
  input: string,
  country?: CountryCode,
  style: "national" | "international" = "national",
): string | null {
  const info = parse(input, country);
  if (!info) return null;
  const data = getCountry(info.country);
  const national = group(info.national, data.groups);
  return style === "international" ? `+${data.dialCode} ${national}` : national;
}
