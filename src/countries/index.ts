import type { CountryCode, CountryData } from "../types";
import { BF } from "./bf";
import { BJ } from "./bj";
import { CG } from "./cg";
import { CI } from "./ci";
import { CM } from "./cm";
import { ML } from "./ml";
import { NE } from "./ne";
import { SN } from "./sn";
import { TG } from "./tg";

export const COUNTRIES: Record<CountryCode, CountryData> = { BF, BJ, CG, CI, CM, ML, NE, SN, TG };

export function getCountry(code: CountryCode): CountryData {
  const country = COUNTRIES[code];
  if (!country) throw new Error(`Unsupported country: ${code}`);
  return country;
}

export function findCountryByDialCode(digits: string): CountryData | null {
  return Object.values(COUNTRIES).find((country) => digits.startsWith(country.dialCode)) ?? null;
}
