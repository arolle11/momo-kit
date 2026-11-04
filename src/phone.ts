import { parsePhoneNumberFromString, type PhoneNumber } from "libphonenumber-js/max";
import { getCountry } from "./countries";
import type { CountryCode, CountryData, LineType, Operator, PhoneInfo } from "./types";

function clean(input: string): string {
  return input.replace(/[\s.\-()/]/g, "");
}

function upgradeLegacy(phone: PhoneNumber): PhoneNumber {
  if (phone.isValid()) return phone;
  const legacy = getCountry(phone.country)?.legacy;
  const national = phone.nationalNumber as string;
  if (!legacy || national.length !== legacy.length || national.startsWith(legacy.prefix)) return phone;
  return parsePhoneNumberFromString(`+${phone.countryCallingCode}${legacy.prefix}${national}`) ?? phone;
}

function read(input: string, country?: CountryCode): PhoneNumber | null {
  const digits = clean(input);
  if (!digits) return null;

  const international = digits.startsWith("+") || digits.startsWith("00");
  const attempts = international || country ? [digits] : [`+${digits}`];
  if (country && !international) attempts.push(`+${digits}`);

  for (const attempt of attempts) {
    const parsed = parsePhoneNumberFromString(attempt.replace(/^00/, "+"), country);
    if (!parsed) continue;
    if (country && parsed.country !== country) continue;
    const phone = upgradeLegacy(parsed);
    if (phone.isValid()) return phone;
  }
  return null;
}

function lineType(phone: PhoneNumber): LineType {
  const type = phone.getType();
  if (type === "MOBILE" || type === "FIXED_LINE_OR_MOBILE") return "mobile";
  if (type === "FIXED_LINE") return "fixed";
  return "other";
}

function findOperator(national: string, country: CountryData | null): Operator | null {
  if (!country) return null;
  let best: Operator | null = null;
  let bestLength = 0;
  for (const operator of country.operators) {
    for (const prefix of operator.prefixes) {
      if (prefix.length > bestLength && national.startsWith(prefix)) {
        best = operator;
        bestLength = prefix.length;
      }
    }
  }
  return best;
}

export function parse(input: string, country?: CountryCode): PhoneInfo | null {
  const phone = read(input, country);
  if (!phone?.country) return null;

  const national = phone.nationalNumber as string;
  const type = lineType(phone);
  const operator = findOperator(national, getCountry(phone.country));
  return {
    country: phone.country,
    national,
    international: phone.number as string,
    type,
    operator: operator?.name ?? null,
    wallet: type === "mobile" ? (operator?.wallet ?? null) : null,
  };
}

export function isValid(input: string, country?: CountryCode): boolean {
  return read(input, country) !== null;
}

export function normalize(input: string, country?: CountryCode): string | null {
  return read(input, country)?.number ?? null;
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
  const phone = read(input, country);
  if (!phone) return null;
  return style === "international" ? phone.formatInternational() : phone.formatNational();
}
