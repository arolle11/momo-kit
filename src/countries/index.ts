import type { CountryCode, CountryData, SupportedCountry } from "../types";
import { BF } from "./bf";
import { BJ } from "./bj";
import { CG } from "./cg";
import { CI } from "./ci";
import { CM } from "./cm";
import { ML } from "./ml";
import { NE } from "./ne";
import { SN } from "./sn";
import { TG } from "./tg";

export const COUNTRIES: Record<SupportedCountry, CountryData> = { BF, BJ, CG, CI, CM, ML, NE, SN, TG };

export function getCountry(code: CountryCode | undefined): CountryData | null {
  return code && code in COUNTRIES ? COUNTRIES[code as SupportedCountry] : null;
}
