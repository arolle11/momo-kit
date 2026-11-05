import { parsePhoneNumberFromString, type PhoneNumber } from "libphonenumber-js/max";
import { getCountry } from "./countries";
import type { CountryCode, CountryData, LineType, Operator, OperatorInfo, PhoneInfo, Provider } from "./types";

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

function resolveOperator(input: string, country?: CountryCode) {
  const phone = read(input, country);
  if (!phone?.country) return null;
  const national = phone.nationalNumber as string;
  const type = lineType(phone);
  const operator = findOperator(national, getCountry(phone.country));
  return { phone, country: phone.country, national, type, operator };
}

export function parse(input: string, country?: CountryCode): PhoneInfo | null {
  const resolved = resolveOperator(input, country);
  if (!resolved) return null;
  const { phone, national, type, operator } = resolved;
  return {
    country: resolved.country,
    national,
    international: phone.number as string,
    type,
    operatorId: operator?.id ?? null,
    operator: operator?.name ?? null,
    wallet: type === "mobile" ? (operator?.wallet ?? null) : null,
    color: operator?.color ?? null,
  };
}

export function isValid(input: string, country?: CountryCode): boolean {
  return read(input, country) !== null;
}

export function normalize(input: string, country?: CountryCode): string | null {
  return read(input, country)?.number ?? null;
}

export function detectOperator(input: string, country?: CountryCode): OperatorInfo | null {
  const info = parse(input, country);
  if (!info?.operator || !info.operatorId) return null;
  return { country: info.country, id: info.operatorId, operator: info.operator, wallet: info.wallet, color: info.color };
}

export function getProviderCode(input: string, provider: Provider, country?: CountryCode): string | null {
  const resolved = resolveOperator(input, country);
  if (!resolved || resolved.type !== "mobile") return null;
  return resolved.operator?.providers?.[provider] ?? null;
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
