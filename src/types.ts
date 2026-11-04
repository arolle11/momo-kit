import type { CountryCode } from "libphonenumber-js";

export type { CountryCode };

export type SupportedCountry = "BF" | "BJ" | "CG" | "CI" | "CM" | "ML" | "NE" | "SN" | "TG";

export interface Operator {
  name: string;
  wallet: string | null;
  prefixes: string[];
}

export interface CountryData {
  code: SupportedCountry;
  currency: "XAF" | "XOF";
  legacy?: { length: number; prefix: string };
  operators: Operator[];
}

export type LineType = "mobile" | "fixed" | "other";

export interface PhoneInfo {
  country: CountryCode;
  national: string;
  international: string;
  type: LineType;
  operator: string | null;
  wallet: string | null;
}
